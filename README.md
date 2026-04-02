 # 🏦 ChitiBank — Sistema Bancario Educativo

 ChitiBank es una aplicación web educativa que simula un entorno bancario para colegios. Facilita que estudiantes, padres y personal escolar interactúen con cuentas, transacciones y reportes bajo el control del personal docente. El objetivo es enseñar conceptos financieros básicos (ahorro, transferencias, historial) en un entorno seguro y cerrado.

 **Principales objetivos:**
 - Enseñanza práctica de conceptos financieros para estudiantes.
 - Control y supervisión desde un panel administrativo para docentes.
 - Flujos seguros de creación de usuario y manejo de cuentas que evitan inconsistencias (ej. cuentas sin perfil).

 **Resumen del sistema:**
 - Frontend: Next.js con App Router + TypeScript + Tailwind CSS (shadcn/ui components).
 - Backend: Supabase Auth + Neon Postgres + API Routes de Next.js para lógica crítica transaccional.
 - Despliegue: Vercel (frontend + API) y Neon (DB). Supabase se mantiene para Auth.

 --

 **Tabla de contenidos**
 1. Visión general
 2. Arquitectura y stack
 3. Esquema de Base de Datos (tablas y relaciones)
 4. Migraciones y funciones almacenadas importantes
 5. Edge Functions (Supabase)
 6. Frontend: estructura, páginas y componentes importantes
 7. Configuración y despliegue (Vercel & Supabase)
 8. Desarrollo local
 9. Notas operativas y seguridad

 --

 **1) Visión general**

 ChitiBank está pensado para entornos educativos: los estudiantes tienen cuentas con las que pueden aprender a manejar dinero virtual. Los profesores (administradores) gestionan cuentas, pueden otorgar saldo inicial y ver reportes. El sistema garantiza que cada usuario tenga un perfil (`perfiles`) y una cuenta (`cuentas`) consistente creada en una operación atómica.

 **2) Arquitectura y stack**
 - Frontend: Next.js (App Router), TypeScript
 - UI: Tailwind CSS, shadcn/ui components
 - Backend: Supabase (Postgres), Supabase Auth
 - Edge Functions: Deno (Supabase Functions) para operaciones sensibles (creación atómica de usuarios, transacciones administrativas)
 - Despliegue: Vercel para la app Next.js; Supabase gestiona DB y funciones

 **3) Esquema de Base de Datos (resumen completo)**

 Ruta en repo para migraciones: `supabase/migrations/`

 Tablas principales (nombre / campos clave / notas):
 - `auth.users` (gestión de usuarios por Supabase Auth)
 - `perfiles` (perfil de usuario)
     - `id` uuid PRIMARY KEY REFERENCES `auth.users(id)`
     - `nombre_completo` text
     - `email` text
     - `rol` text CHECK (rol IN ('admin','cliente','otro')) — control de autorización (simplificado)
     - `tipo` text CHECK (tipo IN ('alumno','padre','personal')) — clasificación del cliente dentro de la institución
     - `created_at` timestamp
 - `cuentas` (cuentas bancarias)
     - `id` uuid PRIMARY KEY
     - `usuario_id` uuid REFERENCES `perfiles(id)` UNIQUE
     - `numero_cuenta` text UNIQUE — generado vía secuencia `numero_cuenta_seq`
     - `saldo` numeric (o decimal)
     - `created_at` timestamp
 - `transacciones`
     - `id` uuid PRIMARY KEY
     - `cuenta_id` uuid REFERENCES `cuentas(id)`
     - `tipo` text CHECK (tipo IN ('deposito','retiro','transferencia'))
     - `monto` numeric
     - `descripcion` text
     - `created_at` timestamp

 Relaciones/constraints importantes:
 - `cuentas.usuario_id` es UNIQUE y FK hacia `perfiles(id)`. Esto garantiza 1:1 perfil->cuenta.
 - `numero_cuenta` se genera mediante la secuencia `numero_cuenta_seq` y la función RPC `create_account_for_user` que inserta la fila en `cuentas` de manera atómica.

 **4) Migraciones y funciones almacenadas clave**
 - `001_create_numero_cuenta_seq_and_function.sql` — crea `numero_cuenta_seq` y la función `create_account_for_user(usuario_id uuid, saldo numeric)` que:
     - genera un `numero_cuenta` único basado en la secuencia,
     - inserta la cuenta con saldo inicial en una operación atómica,
     - devuelve la fila creada o lanza error si falla.
 - `002_add_tipo_to_perfiles_and_constraints.sql` — añade la columna `tipo` a `perfiles`, crea constraints y backfill (`tipo='alumno'` por defecto para registros existentes).

 Estas migraciones están en `supabase/migrations/` y deben aplicarse en orden.

 **5) Edge Functions (Supabase)**
 Carpeta de funciones en repo: `supabase/functions/`

 Funciones más importantes:
 - `crear-usuario-cliente` (`supabase/functions/crear-usuario-cliente/index.ts`)
     - Propósito: Proveer un único punto de creación para:
         - crear el usuario en Supabase Auth,
         - insertar el `perfil` en `perfiles` (incluyendo `tipo` y `rol`),
         - invocar RPC `create_account_for_user` para crear la `cuenta` de forma atómica,
         - registrar transacción inicial si aplica.
     - Seguridad: la función usa `SUPABASE_SERVICE_ROLE_KEY` internamente; para operaciones administrativas puede requerir cabecera `x-admin-secret` o validación de JWT que pertenezca a un `perfil` con rol admin.
     - Nota: Las llamadas públicas (registro desde UI) siempre crean cuentas con `saldo_inicial=0` y `tipo='alumno'` para evitar privilegios.

 - Otras funciones (por proyecto):
     - `gestionar-fondos` — (si está presente) para operaciones administrativas de ajuste de saldo.
     - `iniciar-transferencia-cliente` — inicia flujos de transferencia entre cuentas.

 **6) Frontend — Estructura y páginas completas**

 Carpeta principal: `src/app/`

 Rutas y páginas (resumen):
 - `src/app/page.tsx` — Landing pública.
 - `src/app/auth/`
     - `login/page.tsx` — formulario de inicio de sesión.
     - `register/page.tsx` — formulario de registro público. Llama a la Edge Function `crear-usuario-cliente` para crear Auth + perfil + cuenta (saldo 0 para registros públicos).
     - `confirm/route.ts` — endpoint de confirmación (handlers de Supabase Auth callbacks).
     - `auth-code-error/page.tsx` — página de error para flujos de OAuth o confirmación.
 - `src/app/(cliente)/` — rutas protegidas para clientes (estudiantes):
     - `dashboard/page.tsx` — muestra saldo, actividad reciente.
     - `transferir/page.tsx` — formulario para enviar dinero a otros estudiantes.
 - `src/app/admin/` — panel de administración (protegido por guardas/roles):
     - `page.tsx` — admin dashboard con métricas.
     - `configuracion/page.tsx` — configuración del banco/escuela.
     - `lista-alumnos/page.tsx` & `page-client.tsx` — listado de estudiantes (client/server variants).
     - `nuevo-alumno/page.tsx` — formulario para crear alumnos desde admin (invoca directamente la Edge Function `crear-usuario-cliente` usando el SDK de Supabase; ya no existe un proxy server-side por defecto).
 - `src/app/api/drive-scrape/route.ts` — ejemplo de API route para scraping o integración con Google Drive (puede ser un util interno).

 Componentes y utilidades clave (`src/components` y `src/lib`):
 - `src/components/admin-guard.tsx` y `client-guard.tsx` — wrappers que protegen rutas según rol.
 - `src/components/ui/*` — componentes UI reutilizables (Button, Input, Table, Dialog, etc.) basados en shadcn/ui.
 - `src/lib/supabase/client.ts` — crea el cliente Supabase para llamadas desde el cliente.
 - `src/lib/supabase/server.ts` — cliente Supabase con credenciales server-side (service role) para llamadas en server code.
 - `src/lib/supabase/middleware.ts` — middleware para verificar sesiones/roles en SSR/server routes.
 - `src/lib/supabase/database.types.ts` — tipos TypeScript generados para tablas (incluye `perfiles.tipo`).

 **7) Configuración y despliegue (Vercel & Supabase)**

 Recomendación: desplegar la app Next.js en Vercel y las Edge Functions ya son desplegadas desde la carpeta `supabase/functions` usando la CLI o la integración de Supabase.

 Variables de entorno (importantes):
 - Para Vercel (frontend):
     - `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (solo para client SDK).
 - Para server-side (Vercel/Server routes):
     - `SUPABASE_SERVICE_ROLE_KEY` — clave con privilegios server (NO exponer al cliente).
     - `DATABASE_URL` — connection string de Neon para consultas SQL y operaciones transaccionales.
    - `ADMIN_CREATE_SECRET` — (opcional/legacy) secreto que se usaba cuando se proxyaba la llamada a través de un endpoint server-side. Con la llamada directa desde el admin UI a la Edge Function, este secreto no es estrictamente necesario; la función valida Authorization Bearer tokens o `x-admin-secret` si configurado.
 - Para Supabase Functions (en el dashboard de Supabase):
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (en variables de función; necesario para crear usuarios y manipular DB)
    - `ADMIN_CREATE_SECRET` (opcional) — si quieres que la Edge Function permita una segunda vía de autenticación administrativa basada en un secreto compartido (por ejemplo para proxies o sistemas externos), puedes configurar `ADMIN_CREATE_SECRET` en las variables de la función. No es obligatorio cuando la UI usa el SDK y pasa Authorization Bearer tokens.

 Despliegue recomendado:
 1. Aplicar migraciones en Supabase (ordenadas): `supabase/migrations/001_...`, luego `002_...`.
 2. Desplegar Edge Functions con `supabase functions deploy crear-usuario-cliente --project-ref <ref>` o usando la UI.
 3. Desplegar Next.js a Vercel. Configurar variables de entorno en Vercel siguiendo las claves indicadas.

 **8) Desarrollo local**

 Requisitos:
 - Node.js (versión usada en proyecto, ver `package.json`), npm >= 8
 - Acceso a un proyecto Supabase (URL + anon/service role keys)

 Pasos rápidos:
 - Instala dependencias:
 ```powershell
 npm install
 ```
 - Variables locales: crea un `.env.local` con:
 ```
 NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
 NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
 SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
 DATABASE_URL=<your_neon_connection_string>
# ADMIN_CREATE_SECRET is optional and only needed if you use a proxy flow
# ADMIN_CREATE_SECRET=<random_secret_for_admin_calls>
 ```
 - Desarrollar en local:
 ```powershell
 npm run dev
 ```
 - Build de producción:
 ```powershell
 npm run build
 npm run start
 ```

 **9) Notas operativas y seguridad**
 - Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` ni `ADMIN_CREATE_SECRET` en clientes.
 - Las llamadas administrativas deben pasar por una ruta server-side que valide la sesión y reenvíe la petición a la función con el secreto.
 - Las registraciones públicas se limitan a `tipo='alumno'` y `saldo_inicial=0`.

 --

 Apéndice: Estructura del repo (resumen)
 ```
 .
 ├─ public/
 ├─ src/
 │  ├─ app/
 │  │  ├─ (admin)/
 │  │  ├─ (cliente)/
 │  │  ├─ auth/
 │  │  ├─ api/
 │  │  └─ page.tsx
 │  ├─ components/
 │  └─ lib/
 ├─ supabase/
 │  ├─ functions/
 │  └─ migrations/
 ├─ package.json
 └─ README.md (este archivo)
 ```

 Si quieres, puedo:
 - Expandir la sección de esquema de la base de datos con los SQL exactos de cada migración (copiar/pegar el contenido de `supabase/migrations/*`).
 - Añadir una sección de troubleshooting con errores comunes y cómo verificarlos en Supabase.
 - Crear un archivo `DEVELOPMENT.md` con pasos de despliegue automatizados.

 ¿Qué prefieres que añada a continuación? (Puedo incluir las migraciones completas y describir cada columna y constraint en detalle.)

**Anexo C — Descripción de páginas, rutas y componentes (detallado)**

Carpeta principal: `src/app`

Páginas y rutas (archivo → descripción):
- `page.tsx` — Landing page pública del sitio (presentación y enlaces a login/register).
- `auth/login/page.tsx` — Formulario de inicio de sesión que usa el cliente Supabase para autenticar.
- `auth/register/page.tsx` — Formulario público de registro. Llama a la Edge Function `crear-usuario-cliente` para crear Auth + perfil + cuenta con `saldo_inicial=0`.
- `auth/confirm/route.ts` — Endpoint para manejar confirmaciones de email / callbacks según implementación de Supabase Auth.
- `auth/auth-code-error/page.tsx` — Página para mostrar errores de flujo de autenticación.
- `documentos/page.tsx` — Página pública que muestra documentos o políticas del banco escolar.

Rutas protegidas por roles (agrupadas):
- `(cliente)/dashboard/page.tsx` — Dashboard del estudiante: saldo, movimientos recientes.
- `(cliente)/dashboard/transferir/page.tsx` — Interfaz para realizar transferencias entre cuentas.

- `admin/page.tsx` — Dashboard administrativo con métricas clave.
- `admin/configuracion/page.tsx` — Ajustes y configuración del sistema para administradores.
- `admin/lista-alumnos/page.tsx` — Listado server-side de alumnos.
- `admin/lista-alumnos/page-client.tsx` — Variante client-side del listado (para búsquedas/filtrado dinámico).
- `admin/nuevo-alumno/page.tsx` — Formulario para que un admin cree alumnos con `saldo_inicial` y `tipo`.

API routes y funciones server-side en `src/app/api/`:
- `api/admin/crear-usuario/route.ts` — Endpoint server that validates requester role and forwards creation request to the Edge Function using `ADMIN_CREATE_SECRET`.
- `api/drive-scrape/route.ts` — Example integration API route (scraping/drive import).

Componentes principales (`src/components`):
- `admin-guard.tsx` — Wrapper to protect admin routes; valida sesión y rol.
- `client-guard.tsx` — Wrapper para rutas de clientes.
- `admin-navigation.tsx` — Navegación lateral/top para el panel de administración.

UI primitives (`src/components/ui`):
- `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `dialog.tsx`, `alert.tsx`, `table.tsx` — componentes estilizados con Tailwind y utilidades compartidas.

Lógica y helpers (`src/lib`):
- `supabase/client.ts` — Crea el cliente Supabase para uso en el navegador (usa `NEXT_PUBLIC_SUPABASE_*`).
- `supabase/server.ts` — Cliente server-side con soporte para cookies y SSR.
- `supabase/middleware.ts` — Helpers/middleware para validar sesiones y roles.
- `supabase/database.types.ts` — Tipos TypeScript generados para las tablas públicas (`perfiles`, `cuentas`, `transacciones`, funciones como `realizar_transferencia`).

Supabase Functions (`supabase/functions/`):
- `crear-usuario-cliente/` — Edge Function para creación atómica de usuario+perfil+cuenta.
- `gestionar-fondos/`, `iniciar-transferencia-cliente/` — otras funciones relacionadas con transacciones y flujos (si existen en repo).

Con esto ya tienes un README que cubre los puntos principales: visión, arquitectura, DB, migraciones, funciones y frontend. Puedo ahora:
- Añadir SQL completo de cada migración como apéndice.
- Generar un `DEVELOPMENT.md` para pasos de despliegue y verificación (incluye comandos `supabase` y `vercel`).
- Crear un checklist de operaciones para producción (aplicar migraciones, desplegar functions, configurar variables en Vercel).

Indica cuál prefieres que haga a continuación y lo continuo.


**10) Frontend — Paquetes y versiones (resumen)**

Las dependencias principales están en `package.json`. Resumen de las más relevantes:

- `next`: 15.3.4
- `react`: ^19.0.0
- `@supabase/supabase-js`: ^2.57.2 (SDK de Supabase para cliente/servidor)
- `@supabase/ssr`: ^0.7.0 (helper SSR para Supabase si se requiere)
- `tailwindcss`: ^4 (devDependency)
- `lucide-react`: ^0.468.0 (icon set)
- `class-variance-authority`, `clsx`, `tailwind-merge` — utilidades para clases y estilos

Dev dependencies clave:
- `typescript`: ^5
- `eslint` + `eslint-config-next` (alineado a Next.js 15)

Scripts útiles (desde la raíz del proyecto):
```powershell
npm install
npm run dev    # corre la app en modo desarrollo
npm run build  # crea build de producción
npm run start  # inicia servidor en modo producción
npm run lint   # corre linter (ESLint)
```

Consejo: la app usa el cliente Supabase tanto en cliente como server — revisa `src/lib/supabase/*` para ver cómo se crean las instancias y dónde se usan las keys públicas vs service-role.


--

**Anexo A — Migraciones y detalles SQL**

En `supabase/migrations/` están las migraciones aplicadas por el proyecto. A continuación se resumen las dos migraciones principales que se han añadido:

- `001_create_numero_cuenta_seq_and_function.sql` (resumen):
    - Crea una secuencia `public.numero_cuenta_seq` iniciando en `1000000000` si no existe.
    - Ajusta el valor de la secuencia para evitar colisiones con `numero_cuenta` existentes.
    - Define la función `public.generate_numero_cuenta()` que devuelve un `text` de 10 dígitos usando la secuencia.
    - Define `public.create_account_for_user(p_usuario_id uuid, p_saldo numeric)` que inserta una fila en `public.cuentas` con un `numero_cuenta` único y devuelve la fila creada. Esta RPC proporciona atomicidad al crear cuentas.

- `002_add_tipo_to_perfiles_and_constraints.sql` (resumen):
    - Añade la columna `tipo text NOT NULL DEFAULT 'alumno'` a `public.perfiles`.
    - Añade una constraint `rol_valido` para garantizar `rol IN ('cliente','personal','admin')`.
    - Añade una constraint `tipo_valido` para garantizar `tipo IN ('alumno','padre','personal')`.
    - Ejecuta un `UPDATE` para backfill: `UPDATE public.perfiles SET tipo = 'alumno' WHERE tipo IS NULL OR tipo = '';`

Estas migraciones deben aplicarse con el CLI de Supabase (`supabase db push` o `psql`) en el entorno de producción.

**Anexo B — Edge Function `crear-usuario-cliente` (resumen de implementación)**

Archivo: `supabase/functions/crear-usuario-cliente/index.ts`

Flujo principal que implementa la función:
1. Validación CORS y manejo de `OPTIONS`.
2. Construcción de cliente `supabaseAdmin` usando `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` desde las env vars de la función.
3. Lectura del body con campos: `nombre_completo`, `email`, `password`, `saldo_inicial`, `rol`, `tipo`.
4. Determinación si la llamada proviene de un administrador:
     - Comprueba cabecera `x-admin-secret` frente a `ADMIN_CREATE_SECRET`.
     - Si no hay secreto, intenta validar `Authorization: Bearer <token>` consultando `/auth/v1/user` y verificando el rol en `perfiles`.
5. Si la llamada NO es admin, fuerza `saldo_inicial = 0`, `rol = 'cliente'` y `tipo = 'alumno'`.
6. Crea el usuario en Supabase Auth con `supabaseAdmin.auth.admin.createUser(...)` (marca email_confirm true para evitar email pendiente en entorno educativo).
7. Inserta fila en `perfiles` con `id` = `auth.user.id`, `nombre_completo`, `rol` y `tipo`.
8. Intenta invocar la RPC `create_account_for_user` para crear la cuenta de forma atómica; si falla, hace un fallback con inserciones en `cuentas` intentando generar `numero_cuenta` con retries.
9. Si `saldo_inicial > 0` registra una transacción inicial en `transacciones`.
10. Devuelve 201 en caso de éxito con `{ userId, message }`, o 400 con `{ error }` en error.

Nota de seguridad: la ruta API requiere `SUPABASE_SERVICE_ROLE_KEY` para operaciones administrativas de Auth; en producción debe almacenarse como variable de entorno del backend (por ejemplo en Vercel), nunca en el repositorio ni en el cliente.
