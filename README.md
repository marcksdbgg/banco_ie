 # 🏦 ChitiBank — Sistema Bancario Educativo

 ChitiBank es una aplicación web educativa que simula un entorno bancario para colegios. Facilita que estudiantes, padres y personal escolar interactúen con cuentas, transacciones y reportes bajo el control del personal docente. El objetivo es enseñar conceptos financieros básicos (ahorro, transferencias, historial) en un entorno seguro y cerrado.

 **Principales objetivos:**
 - Enseñanza práctica de conceptos financieros para estudiantes.
 - Control y supervisión desde un panel administrativo para docentes.
 - Flujos seguros de creación de usuario y manejo de cuentas que evitan inconsistencias (ej. cuentas sin perfil).

 **Resumen del sistema:**
 - Frontend: Next.js con App Router + TypeScript + Tailwind CSS (shadcn/ui components).
 - Backend: Auth propio (JWT + bcrypt) + Neon Postgres + API Routes de Next.js para toda la lógica.
 - Despliegue: Vercel (frontend + API) y Neon (DB). No se usa Supabase.

 --

 **Tabla de contenidos**
 1. Visión general
 2. Arquitectura y stack
 3. Esquema de Base de Datos (tablas y relaciones)
 4. Migraciones y funciones almacenadas importantes
 5. API Routes (reemplazan Edge Functions)
 6. Frontend: estructura, páginas y componentes importantes
 7. Configuración y despliegue (Vercel & Neon)
 8. Desarrollo local
 9. Notas operativas y seguridad

 --

 **1) Visión general**

 ChitiBank está pensado para entornos educativos: los estudiantes tienen cuentas con las que pueden aprender a manejar dinero virtual. Los profesores (administradores) gestionan cuentas, pueden otorgar saldo inicial y ver reportes. El sistema garantiza que cada usuario tenga un perfil (`perfiles`) y una cuenta (`cuentas`) consistente creada en una operación atómica.

 **2) Arquitectura y stack**
 - Frontend: Next.js (App Router), TypeScript
 - UI: Tailwind CSS, shadcn/ui components
 - Base de datos: Neon (Postgres serverless) — todas las consultas y datos van a Neon.
 - Auth: JWT firmado con `jose` (HS256), almacenado en cookie httpOnly. Contraseñas hasheadas con `bcryptjs`.
 - API Routes de Next.js para operaciones sensibles (creación atómica de usuarios, transacciones administrativas).
 - Despliegue: Vercel para la app Next.js; Neon para la DB.

 **3) Esquema de Base de Datos (resumen completo)**

 Ruta en repo para migraciones: `supabase/migrations/` (aplícalas en orden numérico en Neon).

 Tablas principales (nombre / campos clave / notas):
 - `usuarios` (credenciales de autenticación)
     - `id` uuid PRIMARY KEY
     - `email` text UNIQUE NOT NULL
     - `password_hash` text NOT NULL — hash bcrypt de la contraseña
     - `created_at` timestamp
 - `perfiles` (perfil de usuario)
     - `id` uuid PRIMARY KEY REFERENCES `usuarios(id)` ON DELETE CASCADE
     - `nombre_completo` text
     - `rol` text CHECK (rol IN ('admin','cliente'))
     - `tipo` text CHECK (tipo IN ('alumno','padre','personal')) — clasificación del cliente dentro de la institución
 - `cuentas` (cuentas bancarias)
     - `id` uuid PRIMARY KEY
     - `usuario_id` uuid REFERENCES `perfiles(id)`
     - `numero_cuenta` text UNIQUE — generado vía secuencia `numero_cuenta_seq`
     - `saldo_actual` numeric
     - `fecha_apertura` timestamp
 - `transacciones`
     - `id` uuid PRIMARY KEY
     - `cuenta_origen_id` uuid REFERENCES `cuentas(id)`
     - `cuenta_destino_id` uuid REFERENCES `cuentas(id)`
     - `tipo` text (deposito, retiro, transferencia)
     - `monto` numeric
     - `descripcion` text
     - `fecha` timestamp
 - `amistades` — solicitudes y relaciones de amistad entre usuarios
 - `notificaciones` — notificaciones para usuarios

 Relaciones/constraints importantes:
 - `perfiles.id` es FK hacia `usuarios(id)`. Esto garantiza 1:1 usuario->perfil.
 - `numero_cuenta` se genera mediante la secuencia `numero_cuenta_seq` y la función RPC `create_account_for_user` que inserta la fila en `cuentas` de manera atómica.

 **4) Migraciones y funciones almacenadas clave**
 - `000_create_base_schema.sql` — crea las tablas base (`usuarios`, `perfiles`, `cuentas`, `transacciones`), la secuencia `numero_cuenta_seq`, la función `create_account_for_user`, y la función `realizar_transferencia` (transferencia atómica entre cuentas).
 - `001_create_numero_cuenta_seq_and_function.sql` — crea/actualiza la secuencia y la función `create_account_for_user`.
 - `002_add_tipo_to_perfiles_and_constraints.sql` — añade la columna `tipo` a `perfiles`, crea constraints y backfill.
 - `003_create_friends_and_notifications.sql` — crea las tablas `amistades` y `notificaciones`.

 Estas migraciones están en `supabase/migrations/` y deben aplicarse **en orden** en la base de datos Neon.

 **5) API Routes (reemplazan Edge Functions)**

 Todos los endpoints de lógica de negocio son API Routes de Next.js en `src/app/api/`:

 - `POST /api/auth/login` — autenticación con email/contraseña, establece cookie httpOnly.
 - `POST /api/auth/logout` — cierra sesión eliminando la cookie.
 - `GET  /api/auth/me` — retorna el usuario autenticado actual.
 - `POST /api/functions/crear-usuario-cliente` — crea usuario, perfil y cuenta en Neon de forma atómica.
 - `POST /api/functions/gestionar-fondos` — operaciones de depósito/retiro (solo admin).
 - `POST /api/functions/iniciar-transferencia-cliente` — transferencia entre cuentas.
 - `POST /api/functions/solicitar-amistad` — envía solicitud de amistad.
 - `POST /api/functions/gestionar-amistad` — acepta/rechaza/elimina amistad.
 - `POST /api/functions/borrar-usuario-cliente` — elimina usuario y todos sus datos (solo admin).
 - `POST /api/db/query` — proxy de consultas a Neon para componentes client-side.

 **6) Frontend — Estructura y páginas completas**

 Carpeta principal: `src/app/`

 Rutas y páginas (resumen):
 - `src/app/page.tsx` — Landing pública.
 - `src/app/auth/`
     - `login/page.tsx` — formulario de inicio de sesión.
     - `register/page.tsx` — formulario de registro público. Llama a `/api/functions/crear-usuario-cliente`.
     - `auth-code-error/page.tsx` — página de error para flujos de auth.
 - `src/app/(cliente)/` — rutas protegidas para clientes (estudiantes):
     - `dashboard/page.tsx` — muestra saldo, actividad reciente.
     - `transferir/page.tsx` — formulario para enviar dinero a otros estudiantes.
 - `src/app/admin/` — panel de administración (protegido por guardas/roles):
     - `page.tsx` — admin dashboard con métricas.
     - `configuracion/page.tsx` — configuración del banco/escuela.
     - `lista-alumnos/page.tsx` & `page-client.tsx` — listado de estudiantes.
     - `nuevo-alumno/page.tsx` — formulario para crear alumnos desde admin.

 Componentes y utilidades clave (`src/components` y `src/lib`):
 - `src/components/admin-guard.tsx` y `client-guard.tsx` — wrappers que protegen rutas según rol.
 - `src/components/ui/*` — componentes UI reutilizables (Button, Input, Table, Dialog, etc.) basados en shadcn/ui.
 - `src/lib/auth/jwt.ts` — firma y verifica JWT con `jose`.
 - `src/lib/auth/session.ts` — lee la sesión desde la cookie httpOnly (server-side).
 - `src/lib/supabase/client.ts` — cliente personalizado (sin Supabase SDK) para componentes client-side.
 - `src/lib/supabase/server.ts` — cliente personalizado para server components; lee sesión de cookie.
 - `src/lib/neon.ts` — pool de conexiones Neon.

 **7) Configuración y despliegue (Vercel & Neon)**

 Variables de entorno requeridas (Vercel):
 ```
 DATABASE_URL=<neon_connection_string>
 JWT_SECRET=<secret_aleatorio_minimo_32_chars>
 ```

 Despliegue recomendado:
 1. Crear una base de datos en Neon.
 2. Aplicar las migraciones en Neon (en orden): `000_create_base_schema.sql`, luego `001_...`, `002_...`, `003_...`.
 3. Desplegar Next.js a Vercel. Configurar las variables de entorno `DATABASE_URL` y `JWT_SECRET`.

 **8) Desarrollo local**

 Requisitos:
 - Node.js (versión usada en proyecto, ver `package.json`), npm >= 8
 - Acceso a una base de datos Neon (connection string)

 Pasos rápidos:
 - Instala dependencias:
 ```powershell
 npm install
 ```
 - Variables locales: crea un `.env.local` con:
 ```
 DATABASE_URL=<your_neon_connection_string>
 JWT_SECRET=<random_secret_at_least_32_characters>
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
 - `JWT_SECRET` debe ser una cadena aleatoria larga (mínimo 32 caracteres). Nunca expongas este valor.
 - Las cookies de sesión son `httpOnly` y `sameSite: lax` — no son accesibles desde JavaScript del cliente.
 - Las registraciones públicas se limitan a `tipo='alumno'` y `saldo_inicial=0`.
 - Todas las operaciones administrativas (gestionar-fondos, borrar-usuario-cliente) validan que el usuario tenga `rol='admin'` en la tabla `perfiles` antes de ejecutarse.

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
 │  ├─ functions/   (legacy, ya no se usan - reemplazadas por API Routes)
 │  └─ migrations/
 ├─ package.json
 └─ README.md (este archivo)
 ```

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
