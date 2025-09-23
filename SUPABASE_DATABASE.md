# Documentación de la Base de Datos Supabase (proyecto: banco_ie)

Fecha: 13/09/2025

Resumen
-------
Este documento describe el esquema de la base de datos `public` del proyecto Supabase `banco_ie`, las tablas principales, columnas, restricciones, índices, funciones (RPC), y cómo la aplicación realiza la autenticación y usa las keys (anon/service-role) en las edge functions.

Contenido
- Resumen del esquema
- Tablas: `perfiles`, `cuentas`, `transacciones` (columnas, tipos, defaults)
- Constraints: PK, FKs, UNIQUE, CHECK
- Índices
- Funciones/RPC en la base de datos: `realizar_transferencia` (y otras detectadas)
- Edge Functions en `supabase/functions`
- Autenticación y configuración (según `supabase/config.toml` y uso en el código)
- Recomendaciones de seguridad y mejoras

Esquema público
---------------
Tablas detectadas en `public`:
- perfiles
- cuentas
- transacciones

1) Tabla `cuentas`
- Columnas
  - `id` : uuid, NOT NULL, DEFAULT `gen_random_uuid()` (PK)
  - `usuario_id` : uuid, NOT NULL, FK -> `perfiles(id)`, UNIQUE
  - `numero_cuenta` : text, NOT NULL, UNIQUE
  - `saldo_actual` : numeric, NOT NULL, DEFAULT `0.00`
  - `fecha_apertura` : timestamp with time zone, NOT NULL, DEFAULT `timezone('utc', now())`

- Constraints notables
  - `cuentas_pkey` (PRIMARY KEY on `id`)
  - `cuentas_usuario_id_fkey` (FOREIGN KEY `usuario_id` -> `perfiles(id)`)
  - `cuentas_usuario_id_key` (UNIQUE on `usuario_id`)
  - `cuentas_numero_cuenta_key` (UNIQUE on `numero_cuenta`)
  - `saldo_no_negativo` (CHECK constraint enforcing saldo no negativo)
  - Varios NOT NULL check constraints generados automáticamente por Postgres for NOT NULL columns

- Índices
  - `cuentas_pkey` (b-tree on `id`)
  - `cuentas_usuario_id_key` (unique b-tree on `usuario_id`)
  - `cuentas_numero_cuenta_key` (unique b-tree on `numero_cuenta`)

2) Tabla `perfiles`
- Columnas
  - `id` : uuid, NOT NULL (PK)
  - `nombre_completo` : text, NOT NULL
  - `rol` : text, NOT NULL, DEFAULT `'cliente'`::text
  - `fecha_creacion` : timestamp with time zone, NOT NULL, DEFAULT `timezone('utc', now())`

- Constraints
  - `perfiles_pkey` (PRIMARY KEY on `id`)
  - `perfiles_id_fkey` (FOREIGN KEY `id` -> `users(id)`?) - NOTE: There is an FK referencing `users` inferred in the typed file. In the DB inspection, `perfiles_id_fkey` exists but referenced table may be part of `auth` schema; the typed db file shows relation to `users(id)` (auth.users)
  - `rol_valido` (CHECK constraint to validate `rol` values)

- Índices
  - `perfiles_pkey` (b-tree on `id`)

3) Tabla `transacciones`
- Columnas
  - `id` : bigint, NOT NULL (PK)
  - `cuenta_origen_id` : uuid, NULLABLE, FK -> `cuentas(id)`
  - `cuenta_destino_id` : uuid, NULLABLE, FK -> `cuentas(id)`
  - `monto` : numeric, NOT NULL
  - `tipo` : text, NOT NULL (ej: 'deposito', 'retiro', 'transferencia')
  - `descripcion` : text, NULLABLE
  - `fecha` : timestamp with time zone, NOT NULL, DEFAULT `timezone('utc', now())`

- Constraints
  - `transacciones_pkey` (PRIMARY KEY on `id`)
  - `transacciones_cuenta_origen_id_fkey` (FOREIGN KEY -> `cuentas(id)`)
  - `transacciones_cuenta_destino_id_fkey` (FOREIGN KEY -> `cuentas(id)`)
  - `monto_positivo` (CHECK enforcing monto > 0)
  - `origen_o_destino_requerido` (CHECK ensuring origen o destino presente)
  - `tipo_transaccion_valido` (CHECK enforcing valid `tipo` values)

- Índices
  - `transacciones_pkey` (b-tree on `id`)

Funciones/RPC en la base de datos
---------------------------------
Se detectaron rutinas en el esquema `public`:

1) `realizar_transferencia(cuenta_origen_id_param uuid, numero_cuenta_destino_param text, monto_param numeric) RETURNS void`
- Comportamiento (resumen):
  - Verifica que quien ejecuta tiene permiso (usa `auth.uid()` para validar propietario de `cuenta_origen_id_param`).
  - Busca la `cuenta_destino` por `numero_cuenta_destino_param` con `FOR UPDATE`.
  - Verifica que la cuenta destino existe y que no es la misma que la origen.
  - Verifica saldo suficiente en la cuenta origen.
  - Actualiza `saldo_actual` restando y sumando en origen/destino (bloqueando filas para concurrencia).
  - Inserta una fila en `transacciones` con tipo `'transferencia'` y una descripción automatizada.
  - Lanza excepción con mensajes claros en caso de error (cuenta inexistente, saldo insuficiente, permiso denegado).

2) `realizar_movimiento(...) RETURNS boolean` (se detectó otra función con nombre `realizar_movimiento`, que maneja retiros/depositos/transferencias) -- definición parcial detectada.
- Nota: `realizar_movimiento` parece ser una versión anterior o auxiliar. Documentar con precaución y revisar código si se usa.

Edge Functions (carpeta `supabase/functions`)
----------------------------------------------
En el repo existe una carpeta `supabase/functions` con las siguientes funciones:
- `crear-usuario-cliente/index.ts` (Edge Function Deno)
  - Usa `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_URL` para crear usuarios vía `supabaseAdmin.auth.admin.createUser`, inserta en `perfiles`, crea `cuentas` y registra `transacciones` si `saldo_inicial > 0`.
  - Genera `numero_cuenta` aleatorio de 10 dígitos.
  - CORS habilitado con cabeceras en `_shared/cors.ts`.

- `gestionar-fondos/index.ts`
  - Usa `SUPABASE_SERVICE_ROLE_KEY` para modificar saldos (depósito/retiro) y registrar transacciones.
  - Nota: TODO en código para verificar que quien llama es admin.

- `iniciar-transferencia-cliente/index.ts`
  - Usa `SUPABASE_ANON_KEY` junto con el header Authorization del request para autenticar al usuario (usa `supabase.auth.getUser()`)
  - Encuentra la cuenta del usuario (por `usuario_id`) y llama al RPC `realizar_transferencia` con `rpc`.

Autenticación y configuración
-----------------------------
- `supabase/config.toml` indica `auth.enabled = true` y configuración local (jwt_expiry, enable_signup = true, etc.).
- El código del frontend/server crea clientes Supabase:
  - `src/lib/supabase/client.ts` usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para el cliente de navegador.
  - `src/lib/supabase/server.ts` usa también `NEXT_PUBLIC_SUPABASE_ANON_KEY` y maneja cookies para sesiones en Server Components.
- Edge Functions:
  - `crear-usuario-cliente` y `gestionar-fondos` usan `SUPABASE_SERVICE_ROLE_KEY` (privilegiada) para operaciones administrativas.
  - `iniciar-transferencia-cliente` usa `SUPABASE_ANON_KEY` pero reenvía la cabecera `Authorization` para que `supabase.auth.getUser()` resuelva el usuario autenticado.

RLS (Row Level Security) y políticas
-----------------------------------
- NO HAY RLS, SERÁ IMPLEMENTADO A FUTURO.

Archivos relevantes en el repo
------------------------------
- `src/lib/supabase/database.types.ts` — tipado generado que refleja las tablas `cuentas`, `perfiles`, `transacciones` y la función `realizar_transferencia`.
- `src/lib/supabase/client.ts` — creación de cliente browser.
- `src/lib/supabase/server.ts` — creación de cliente server con cookies.
- `supabase/config.toml` — configuración local de supabase (auth, api, ports, etc.).
- `supabase/functions/*` — Edge Functions: `crear-usuario-cliente`, `gestionar-fondos`, `iniciar-transferencia-cliente`.

Apéndice: Resultados SQL crudos

## Apéndice: Esquema de Amistades y Notificaciones (Feature: Friends)

4) Tabla `amistades`
- Columnas
  - `id`: bigint, PK
  - `usuario_solicitante_id`: uuid, FK -> `perfiles(id)` (quien envía la solicitud)
  - `usuario_receptor_id`: uuid, FK -> `perfiles(id)` (quien recibe la solicitud)
  - `estado`: text, NOT NULL, DEFAULT `'pendiente'` (valores: 'pendiente', 'aceptada', 'bloqueada')
  - `fecha_solicitud`: timestamptz
  - `fecha_actualizacion`: timestamptz
- Constraints notables
  - `unique_friendship_pair`: Previene registros duplicados entre dos usuarios.

5) Tabla `notificaciones`
- Columnas
  - `id`: bigint, PK
  - `usuario_id`: uuid, FK -> `perfiles(id)` (dueño de la notificación)
  - `tipo`: text, NOT NULL (ej: 'solicitud_amistad')
  - `mensaje`: text, NOT NULL
  - `enlace`: text, NULLABLE (ej: '/dashboard/amigos')
  - `leida`: boolean, DEFAULT `false`
  - `fecha_creacion`: timestamptz

### Edge Functions (Nuevas)
- `solicitar-amistad/index.ts`
  - Autentica al usuario, busca al destinatario por número de cuenta, y crea una solicitud de amistad en estado 'pendiente'. También crea una notificación para el receptor.
- `gestionar-amistad/index.ts`
  - Un endpoint unificado para que los usuarios acepten, rechacen o eliminen amistades. Valida que el usuario que realiza la acción esté autorizado para hacerlo.

### Privacy, Testing, and Rollout Strategy
**Privacy Settings:** Para una implementación mínima, se omiten controles de privacidad detallados. Una mejora futura podría agregar una columna a la tabla perfiles (por ejemplo, permitir_solicitudes_amistad BOOLEAN) para que los usuarios puedan rechazar solicitudes.

**Testing:**
- Manual: Crear dos cuentas de prueba. Usuario A envía solicitud a Usuario B. Usuario B recibe notificación y acepta. Ambos deben verse como amigos. Probar también la función Eliminar.
- Automatizado (futuro): Escribir tests de integración para las Edge Functions usando herramientas de Supabase.

**Monitoring:** Monitorear los logs de ejecución de las nuevas Edge Functions en el dashboard de Supabase.

**Rollout con Feature Flags:**
Implementar un flag en las variables de entorno, por ejemplo: NEXT_PUBLIC_FEATURE_FRIENDS_ENABLED=true.
En el archivo src/components/client-navigation.tsx, renderizar condicionalmente el link "Amigos":

```tsx
{process.env.NEXT_PUBLIC_FEATURE_FRIENDS_ENABLED === 'true' && (
    <Link href="/dashboard/amigos" ...>
        <Users className="h-4 w-4" /> Amigos
    </Link>
)}
```
Esto permite desplegar el código sin exponer la funcionalidad hasta que esté lista. Para activarla, basta con setear la variable y redeplegar.

