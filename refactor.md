# Plan de Refactorización: Chitibank a Producción

**Versión:** 1.0
**Fecha:** 07 de septiembre de 2025
**Autor:** Gemini (Senior Software Engineer)

## 1. Análisis de Viabilidad con Supabase (Plan Gratuito)

Tras analizar el plan gratuito de Supabase, se confirma que es perfectamente viable para este proyecto:

*   **Base de Datos:** Ofrece una base de datos PostgreSQL con hasta 500 MB de almacenamiento, más que suficiente para miles de registros de usuarios y transacciones.
*   **Autenticación:** Incluye hasta 50,000 usuarios activos mensuales, cubriendo las necesidades de cualquier colegio.
*   **Edge Functions:** El plan gratuito incluye **2,000,000 de ejecuciones de Edge Functions al mes**, con un tiempo de ejecución de hasta 2 minutos por invocación. Esto es más que suficiente para manejar todas las transacciones y operaciones lógicas del banco sin incurrir en costos.

**Conclusión:** El plan gratuito de Supabase cubre todas las necesidades del proyecto sin limitaciones significativas.

## 2. Diseño de la Base de Datos (Supabase/PostgreSQL)

Se diseñará una estructura de datos normalizada, simple y segura, utilizando la autenticación de Supabase como base.

### 2.1. Roles de Usuario

Se definirán dos roles a nivel de aplicación para la lógica de negocio:
*   `admin`: Profesores o personal administrativo del colegio.
*   `cliente`: Estudiantes con una cuenta en el banco.

### 2.2. Esquema de Tablas (SQL)

A continuación, el código SQL para crear las tablas en el editor de Supabase.

```sql
-- 1. PERFILES DE USUARIO
-- Esta tabla extiende la tabla auth.users de Supabase para añadir metadatos.
CREATE TABLE public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cliente',
  fecha_creacion TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT rol_valido CHECK (rol IN ('admin', 'cliente'))
);

-- 2. CUENTAS BANCARIAS
-- Cada usuario de tipo 'cliente' tendrá una cuenta asociada.
CREATE TABLE public.cuentas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID UNIQUE NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  numero_cuenta TEXT UNIQUE NOT NULL,
  saldo_actual NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  fecha_apertura TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT saldo_no_negativo CHECK (saldo_actual >= 0)
);

-- 3. TRANSACCIONES
-- Registra cada movimiento de dinero.
CREATE TABLE public.transacciones (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cuenta_origen_id UUID REFERENCES public.cuentas(id),
  cuenta_destino_id UUID REFERENCES public.cuentas(id),
  monto NUMERIC(10, 2) NOT NULL,
  tipo TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT tipo_transaccion_valido CHECK (tipo IN ('deposito', 'retiro', 'transferencia')),
  CONSTRAINT monto_positivo CHECK (monto > 0),
  -- Asegura que al menos una de las cuentas (origen o destino) esté presente.
  CONSTRAINT origen_o_destino_requerido CHECK (cuenta_origen_id IS NOT NULL OR cuenta_destino_id IS NOT NULL)
);
```

## 3. Plan de Backend con Edge Functions

La lógica crítica se ejecutará en el servidor para mayor seguridad y consistencia.

*   **Función `crear-usuario-cliente`**:
    *   **Disparador:** Llamada desde el frontend por un `admin`.
    *   **Lógica:**
        1.  Recibe `nombre_completo`, `email`, `password` y `saldo_inicial`.
        2.  Crea el usuario en `Supabase Auth`.
        3.  Inserta un registro en la tabla `perfiles` con el `rol` de 'cliente'.
        4.  Crea un registro en la tabla `cuentas` asociado al nuevo usuario, con el `saldo_inicial` y un `numero_cuenta` único generado.
        5.  Si el `saldo_inicial` es mayor que cero, crea una transacción de tipo 'deposito' inicial.
    *   **Seguridad:** La función debe verificar que quien la invoca es un `admin`.

*   **Función `realizar-transaccion`**:
    *   **Disparador:** Llamada desde el frontend por un `admin` (depósitos/retiros) o un `cliente` (transferencias).
    *   **Lógica:**
        1.  Recibe `tipo_transaccion`, `monto`, `cuenta_origen_id`, `cuenta_destino_id`.
        2.  **Ejecuta todo dentro de una transacción de base de datos (BEGIN/COMMIT/ROLLBACK).**
        3.  Verifica que el usuario tenga permisos para la operación (un cliente solo puede transferir desde su propia cuenta).
        4.  Verifica que la cuenta de origen tenga saldo suficiente.
        5.  Actualiza los saldos de las tablas `cuentas` (resta del origen, suma al destino).
        6.  Inserta un nuevo registro en la tabla `transacciones`.
    *   **Seguridad:** La función validará internamente los permisos del invocador.

## 4. Plan de Refactorización del Frontend (Next.js)

### 4.1. Configuración Inicial
1.  **Instalar dependencias de Supabase:** `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`.
2.  **Configurar Variables de Entorno:** Crear un archivo `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3.  **Crear el Cliente de Supabase:** Crear un archivo en `src/lib/supabase/client.ts` que configure el cliente de Supabase para componentes de cliente.

### 4.2. Refactorización de Autenticación
1.  **Eliminar lógica de `localStorage`:** Remover las funciones de `getAuthData` y `saveAuthData` de los archivos en `lib`.
2.  **Actualizar Contexto Global:** El `ChitiBankProvider` ya no gestionará el estado de `auth`. En su lugar, se usará el cliente de Supabase directamente en los componentes o a través de hooks.
3.  **Refactorizar Páginas de Auth (`/auth/login`, `/auth/register`):**
    *   Reemplazar la lógica de `handleSubmit` con llamadas al cliente de Supabase: `supabase.auth.signInWithPassword()` y `supabase.auth.signUp()`.
    *   El registro de administradores se puede manejar manualmente en Supabase o con una Edge Function protegida. El formulario de registro del frontend solo creará usuarios de tipo `cliente`.
4.  **Actualizar Guardián de Rutas (`AdminGuard`):** Modificar `AdminGuard` para que verifique la sesión del usuario a través de Supabase y, además, consulte la tabla `perfiles` para confirmar que el `rol` es 'admin'. Crear un `ClientGuard` similar para las rutas de estudiante.

### 4.3. Migración de Datos y Lógica
1.  **Eliminar `csv-storage.ts` y `local-storage.ts`:** Toda la persistencia de datos ahora es responsabilidad de Supabase.
2.  **Refactorizar Panel de Administración:**
    *   **`/admin/lista-alumnos`**: Reemplazar la obtención de datos del contexto por una llamada directa a Supabase: `supabase.from('perfiles').select('*, cuentas(*))'`. Utilizar `react-query` o `SWR` para un manejo de datos más robusto (caching, re-fetching).
    *   **`/admin/nuevo-alumno`**: El formulario ya no llamará a `addStudent` del contexto. En su lugar, invocará la Edge Function `crear-usuario-cliente` a través de `supabase.functions.invoke('crear-usuario-cliente', { body: { ... } })`.
    *   **Diálogos de Editar/Eliminar**: Las acciones de estos diálogos invocarán las funciones de Supabase (`supabase.from('perfiles').update(...)`) o Edge Functions dedicadas si la lógica es compleja.

### 4.4. Implementación de la Vista del Cliente
1.  **Crear Nuevas Rutas:** Crear un nuevo grupo de rutas `src/app/(cliente)/dashboard`.
2.  **Página Principal (`/dashboard`):**
    *   **Componente de Saldo:** Mostrará el `saldo_actual` obtenido de la tabla `cuentas` del usuario logueado.
    *   **Componente de Transacciones Recientes:** Hará una consulta a la tabla `transacciones` para mostrar los últimos 5-10 movimientos del usuario.
3.  **Página de Transferencias (`/dashboard/transferir`):**
    *   Crear un formulario simple con campos para "Número de cuenta destino" y "Monto".
    *   Al enviar, se invocará la Edge Function `realizar-transaccion` con el tipo 'transferencia'.
    *   La UI/UX debe ser clara, mostrando confirmaciones y manejando errores de saldo insuficiente o cuenta inexistente.

## 5. Hoja de Ruta Sugerida

1.  **Fase 1: Backend y Configuración (1-2 días)**
    *   [x] Configurar el proyecto en Supabase.
    *   [x] Ejecutar los scripts SQL para crear las tablas.
    *   [x] Configurar el cliente de Supabase en el proyecto Next.js y las variables de entorno.

2.  **Fase 2: Autenticación (2-3 días)**
    *   [x] Refactorizar las páginas de Login y Registro para usar Supabase Auth.
    *   [ ] Implementar el logout.
    *   [x] Actualizar los guardianes de rutas (`AdminGuard` y `ClientGuard`).

3.  **Fase 3: Implementación de Edge Functions (3-4 días)**
    *   [ ] Desarrollar y desplegar la función `crear-usuario-cliente`.
    *   [ ] Desarrollar y desplegar la función `realizar-transaccion`.

4.  **Fase 4: Refactorización del Panel de Administración (3-5 días)**
    *   [ ] Conectar la lista de alumnos a Supabase.
    *   [ ] Conectar el formulario de nuevo alumno a la Edge Function.
    *   [ ] Conectar las funcionalidades de editar y eliminar.
    *   [ ] Añadir la funcionalidad de depósito/retiro para administradores.

5.  **Fase 5: Construcción de la Vista del Cliente (4-6 días)**
    *   [ ] Crear la estructura de rutas y layout para el cliente.
    *   [ ] Desarrollar el dashboard del cliente (saldo y transacciones recientes).
    *   [ ] Desarrollar la funcionalidad de transferencia entre estudiantes.
    *   [ ] Pulir la UI/UX para que sea intuitiva para los niños.

6.  **Fase 6: Pruebas y Despliegue (2-3 días)**
    *   [ ] Realizar pruebas exhaustivas de todos los flujos (admin y cliente).
    *   [ ] Desplegar en Vercel y configurar las variables de entorno de producción.