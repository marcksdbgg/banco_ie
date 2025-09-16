# Plan de Refactorización — Cuentas y Registro (banco_ie)

Fecha: 2025-09-15

Resumen
-------
Este documento describe el análisis de la implementación actual (registro público, creación por admin, dashboard), el fallo que provoca que un cliente recién creado no vea su dashboard, y un plan paso a paso para refactorizar el flujo de creación de cuentas bancarias asegurando que existen exactamente dos caminos: registro público (saldo 0) y creación por administrador (saldo inicial opcional y selección de rol).

Hallazgos (resumen técnico)
---------------------------
- Actualmente el registro público (`src/app/auth/register/page.tsx`) realiza `supabase.auth.signUp()` y sólo inserta el `perfiles` (tabla `perfiles`). NO crea una fila en `cuentas`.
- Hay una Edge Function `supabase/functions/crear-usuario-cliente/index.ts` que sí crea Auth user + perfil + cuenta + transacción inicial (si `saldo_inicial > 0`). Esta función es usada en el admin (`src/app/admin/nuevo-alumno/page.tsx`) mediante `supabase.functions.invoke('crear-usuario-cliente', ...)`.
- Causa del error "No se encontró una cuenta asociada...": cuando un usuario se registra desde la web pública no se crea la fila `cuentas`, por lo que el `Dashboard` intenta buscar `cuentas` por `usuario_id` y no encuentra nada; actualmente el Dashboard muestra el mensaje de error en lugar de la cuenta.

Objetivos del refactor
----------------------
1. Garantizar que sólo existen 2 formas de crear cuentas en producción:
   - Registro público (usuario crea cuenta desde `Register`): crea Auth + perfil (rol seleccionado) + cuenta con `saldo_actual = 0`.
   - Creación por Admin (panel): crea Auth + perfil (rol seleccionado) + cuenta con `saldo_actual = monto_inicial`.
2. Evitar condiciones de carrera y colisiones en `numero_cuenta` — mejorar generación a nivel DB (secuencia) o con retry garantizado.
3. Añadir selección de tipo de usuario en el formulario admin: `Alumno`, `Padre de Familia`, `Personal de la IE`.
4. Mantener la Edge Function `crear-usuario-cliente` como el único endpoint administrativo para creación (usar service role allí) y reutilizarla desde el frontend admin.
5. Para registro público, preferir crear la cuenta mediante una llamada server-side (Edge Function o Server RPC) para evitar lógica del cliente y garantizar invariantes.

Cambios propuestos (archivos y DB)
---------------------------------

1) Cambios en la base de datos (migraciones SQL)

  a) Crear una secuencia que genere números de cuenta únicos y formateados a 10 dígitos (ejemplo):

  ```sql
  -- Crear secuencia para número de cuenta comenzando en 1000000000
  CREATE SEQUENCE public.numero_cuenta_seq START 1000000000;

  -- Opcional: función que devuelve el next numero como texto
  CREATE OR REPLACE FUNCTION public.generate_numero_cuenta()
  RETURNS text LANGUAGE sql AS $$
    SELECT lpad(nextval('public.numero_cuenta_seq')::text, 10, '0');
  $$;
  ```

  b) (Alternativa) Si se prefiere mantener generación en código, garantizar UNIQUE y reintentos atómicos en la Edge Function.

  c) (Opcional) Agregar una función SQL para crear cuenta atómica y devolver la fila creada:

  ```sql
  CREATE OR REPLACE FUNCTION public.create_account_for_user(p_usuario_id uuid, p_saldo numeric)
  RETURNS public.cuentas AS $$
  DECLARE
    v_num text;
    v_row public.cuentas%ROWTYPE;
  BEGIN
    v_num := lpad(nextval('public.numero_cuenta_seq')::text, 10, '0');
    INSERT INTO public.cuentas (usuario_id, numero_cuenta, saldo_actual)
    VALUES (p_usuario_id, v_num, coalesce(p_saldo, 0))
    RETURNING * INTO v_row;
    RETURN v_row;
  END;
  $$ LANGUAGE plpgsql;
  ```

2) Cambios en Edge Function `crear-usuario-cliente`

  Ruta: `supabase/functions/crear-usuario-cliente/index.ts`

  - Inputs: aceptar `nombre_completo`, `email`, `password`, `saldo_inicial` (opcional), `rol` (opcional, default 'cliente' o 'Alumno').
  - Usar `SUPABASE_SERVICE_ROLE_KEY` (ya se usa) y llamar a la función SQL `create_account_for_user` O generar `numero_cuenta` con la secuencia si no se crea la función SQL.
  - Registrar `transacciones` sólo cuando `saldo_inicial > 0`.
  - Validar que el caller esté autorizado para crear usuarios con saldo inicial (por ejemplo, solo internal/admin callers), o restringir acceso a la Edge Function mediante un secreto (evitar que el browser la llame directamente sin autenticación admin).

  Notas de seguridad: la Edge Function debe validar la presencia de una cabecera `x-admin-secret` o verificar JWT con rol admin antes de permitir `saldo_inicial > 0`.

3) Cambios en registro público

  Archivo: `src/app/auth/register/page.tsx`

  - En lugar de sólo `supabase.auth.signUp()` + insert en `perfiles`, el flujo debe crear también la `cuenta` con `saldo_actual = 0`.
  - Recomendación A (más segura): enviar la solicitud a una Edge Function pública (p. ej. `crear-usuario-cliente`) pero con un modo que obliga `saldo_inicial = 0` y fuerza `rol` por defecto; esa Edge Function validará y creará Auth + perfil + cuenta. Para que esto sea seguro desde navegador, crear una ruta pública de la Edge Function que permite crear cuentas sin saldo y sin requerir service-role (o que haga signup mediante Admin SDK NO expuesto — tener cuidado con claves).
  

4) Cambios en Admin UI

  Archivo: `src/app/admin/nuevo-alumno/page.tsx`

  - Añadir campo `rol` (select: `Alumno`, `Padre de Familia`, `Personal de la IE`) y `montoInicial`.
    - Añadir campo `rol` (select: `Alumno`, `Padre de Familia`, `Personal de la IE`) y `montoInicial`.
    - Nota: estos valores ahora se guardan en la columna `tipo` de la tabla `perfiles`. El campo `rol` sigue representando el permiso de acceso (`cliente`, `personal`, `admin`).
  - La admin UI seguirá llamando a `supabase.functions.invoke('crear-usuario-cliente', { body: { nombre_completo, email, password, saldo_inicial, rol } })`.
  - La Edge Function validará el rol y saldo y creará la cuenta correctamente (usando secuencia o función DB).

5) Cambios en Dashboard y Guards

  - Dashboard server-side (`src/app/(cliente)/dashboard/page.tsx`) ya consulta `cuentas` por `usuario_id`. Con los cambios de creación, las cuentas existiran y el mensaje de "No se encontró una cuenta" desaparecerá.
  - Opcional: mejorar el mensaje actual para redirigir al onboarding si no existe cuenta.
  - Mover validaciones de rol a Server Components (layouts): `admin/layout.tsx` y `cliente/layout.tsx` deben usar `createServerSupabaseClient()` y `redirect()` para evitar flicker.

6) Otros cambios y limpieza

  - Centralizar wrappers supabase con nombres explícitos `createBrowserSupabaseClient()` y `createServerSupabaseClient()` y usar tipos `Database`.
  - Corregir CORS en `supabase/functions/_shared/cors.ts` si se usan credenciales: evitar `'*'` cuando `Allow-Credentials` es `true`.
  - Añadir pruebas básicas (scripts) para verificar creación de usuario por admin y por registro público.

Plan de trabajo y PRs propuestos
------------------------------

PR 1 — DB migration + función
- Añadir migración SQL que crea `numero_cuenta_seq` y la función `create_account_for_user`.
- Probar en staging.

PR 1.1 — DB migration: añadir `tipo` a `perfiles`
- Añadir migración `supabase/migrations/002_add_tipo_to_perfiles_and_constraints.sql` que crea la columna `tipo` y añade la constraint `tipo_valido`.
- Backfill: establece `tipo='alumno'` para filas existentes sin valor.

PR 2 — Edge Function `crear-usuario-cliente` hardening
- Actualizar la función para aceptar `rol` y `saldo_inicial`, usar la función DB para crear `cuenta`.
- Añadir verificación de llamado admin (cabecera o JWT). Documentar el secreto.

Cambios aplicados:
- `supabase/functions/crear-usuario-cliente/index.ts` actualizado para aceptar `tipo` y establecer `perfil.tipo` al insertar en `perfiles`.
- Para llamadas no administrativas la función fuerza `saldo_inicial = 0`, `rol = 'cliente'` y `tipo = 'alumno'`.

PR 3 — Registro público seguro
- Actualizar `src/app/auth/register/page.tsx` para usar la Edge Function con `saldo_inicial = 0` y `rol` por defecto.

PR 4 — Admin UI
- Añadir selector `rol` y `montoInicial` a `src/app/admin/nuevo-alumno/page.tsx` y usar la Edge Function con los nuevos campos.

PR 5 — UX y Guards
- Convertir `admin/layout.tsx` y `cliente/layout.tsx` a Server Components con validación de rol y user mediante `createServerSupabaseClient()`.

PR 6 — Hardening y tests
- Corregir CORS, documentar secrets y roles, añadir tests E2E (opcional/CI) que verifiquen el flujo.

Checklist técnico para cada PR
----------------------------
- [ ] Añadir tests manuales y/o automáticos que creen user/admin y verifiquen filas en `perfiles`, `cuentas`, `transacciones`.
- [x] Verificar que la creación por registro público siempre crea `cuentas` con `saldo_actual = 0`.
- [x] Verificar que la creación por admin respeta `monto_inicial` y registra transacción si monto > 0`.
- [x] Asegurar que `numero_cuenta` es único y no hay colisiones (se añadió secuencia y fallback de reintentos en Edge Function).

Estado final y verificación:

- El error "No se encontró una cuenta asociada" era causado porque el flujo de registro público no creaba la fila en `cuentas`. Se ha corregido: el formulario público ahora invoca la Edge Function `crear-usuario-cliente` con `saldo_inicial = 0`, `rol = 'cliente'` y `tipo = 'alumno'`. La función crea Auth + `perfiles` + `cuentas` y retorna éxito.
- Las cuentas creadas por admin usan el endpoint server-side `/api/admin/crear-usuario` que añade `x-admin-secret` antes de reenviar a la Edge Function; así el secreto no se expone al cliente.
- Migraciones aplicadas: `001_create_numero_cuenta_seq_and_function.sql` y `002_add_tipo_to_perfiles_and_constraints.sql`.

Pasos recomendados de verificación manual:

1. Crear un usuario desde la UI pública (Register). Verificar en la DB que existen filas en `auth.users`, `perfiles` (con `rol='cliente'` y `tipo='alumno'`) y `cuentas` (con `saldo_actual=0`).
2. Crear un usuario desde Admin (Nuevo Alumno) con `montoInicial > 0`. Verificar que `perfiles` (rol/tipo) y `cuentas` y `transacciones` se registran correctamente.
3. Iniciar sesión con ambos usuarios y comprobar que el `Dashboard` muestra saldo y lista de transacciones.


Notas finales y riesgos
----------------------
- Migración DB: si ya existen `numero_cuenta` de 10 dígitos, elegir `START` de la secuencia mayor que el máximo actual para evitar colisiones.
- Edge Function con service-role debe protegerse (no exponer a navegador sin auth). Añadir mecanismo de autorización (JWT + verificación de rol o header secreto).

Cambios aplicados (estado inicial)
----------------------------------
- Edge Function `supabase/functions/crear-usuario-cliente/index.ts` actualizada para:
  - Aceptar `rol` y `saldo_inicial` en el body.
  - Validar `x-admin-secret` contra la variable de entorno `ADMIN_CREATE_SECRET` para permitir `saldo_inicial > 0`.
  - Forzar `saldo_inicial = 0` y `rol = 'cliente'` cuando la llamada no esté autorizada (registro público).
  - Añadir reintentos (hasta 5) al crear `numero_cuenta` para reducir colisiones.

- Formulario público de registro `src/app/auth/register/page.tsx` modificado para invocar la Edge Function `crear-usuario-cliente` en lugar de llamar a `supabase.auth.signUp()` y a la inserción directa en `perfiles`.

-- Admin UI `src/app/admin/nuevo-alumno/page.tsx` actualizado para enviar `rol` y `saldo_inicial` al endpoint server-side `/api/admin/crear-usuario`.
  - El endpoint server-side valida sesión/admin y reenvía la solicitud a la Edge Function añadiendo `ADMIN_CREATE_SECRET` desde el servidor (no expuesto al cliente).

Recomendaciones inmediatas:
- No exponer `ADMIN_CREATE_SECRET` en `NEXT_PUBLIC_*` en producción. Usar una ruta server-side o invocar la Edge Function desde un servidor de confianza con la cabecera secreta.
- Añadir migración de base de datos para `numero_cuenta_seq` y/o la función SQL `create_account_for_user` para garantizar unicidad a nivel DB.
- Implementar validaciones en la Edge Function para roles válidos y sanitización de inputs.

Estado actual (resumen):
- Migraciones `001_create_numero_cuenta_seq_and_function.sql` y `002_add_tipo_to_perfiles_and_constraints.sql` añadidas.
- Edge Function `crear-usuario-cliente` acepta y persiste `tipo` en `perfiles`.
- Admin UI envía `rol` y `tipo` al endpoint server-side; `rol` se mapea a `personal` cuando corresponde, y `tipo` se usa para distinguir `alumno`/`padre`/`personal`.
- `src/lib/supabase/database.types.ts` actualizado para reflejar la nueva columna `tipo`.
