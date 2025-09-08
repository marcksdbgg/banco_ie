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

## 3. Plan de Backend con Edge Functions - *Acción Requerida*

Se refina la lógica de las funciones para que sean más específicas y seguras.

*   **Función `crear-usuario-cliente`** *(Lógica ya implementada, verificar y desplegar)*
    *   **Propósito:** Permite a un `admin` crear una nueva cuenta de estudiante.
    *   **Acción:** No requiere cambios en el código actual. Asegurarse de que utiliza claves de `SERVICE_ROLE_KEY` para tener permisos de administrador.

*   **Función `gestionar-fondos` (Nueva)**
    *   **Propósito:** Centraliza las operaciones de depósito y retiro realizadas por un `admin`.
    *   **Disparador:** Llamada desde el frontend por un `admin`.
    *   **Lógica:**
        1.  Verificar que el invocador tiene el rol `admin`.
        2.  Recibe `tipo_operacion` ('deposito' o 'retiro'), `cuenta_id`, `monto`.
        3.  Valida que el `monto` sea positivo.
        4.  Para retiros, verifica que la cuenta tenga saldo suficiente.
        5.  Actualiza el `saldo_actual` en la tabla `cuentas`.
        6.  Inserta un registro en `transacciones` con el tipo correspondiente.

*   **Función `iniciar-transferencia-cliente` (Nueva)**
    *   **Propósito:** Provee un endpoint seguro para que los clientes inicien transferencias.
    *   **Disparador:** Llamada desde el frontend por un `cliente`.
    *   **Lógica:**
        1.  La función es un simple *wrapper* de seguridad.
        2.  Recibe `cuenta_origen_id`, `numero_cuenta_destino`, `monto`.
        3.  Verifica que el `auth.uid()` del usuario que llama coincide con el `usuario_id` de la `cuenta_origen_id`.
        4.  Llama a la función de base de datos: `supabase.rpc('realizar_transferencia', { ...params })`.
        5.  Devuelve el resultado o el error de la función RPC.

## 4. Plan de Refactorización del Frontend (Next.js)

### 4.1. Limpieza de Deuda Técnica
1.  **Eliminar Contexto:** Borrar el archivo `src/contexts/banco-munay-context.tsx`.
2.  **Eliminar Utilidades de Storage:** Borrar los archivos `src/lib/csv-storage.ts` y `src/lib/local-storage.ts`.
3.  **Refactorizar Componentes:** Ir a cada componente que usaba `useBancoMunay` y prepararlo para recibir datos a través de `props` o para hacer sus propias llamadas a Supabase.

### 4.2. Conexión del Panel de Administración
1.  **`/admin/page.tsx` (Dashboard):**
    *   Convertir a Server Component (`async function`).
    *   Usar el `createClient` de `lib/supabase/server` para obtener las estadísticas (conteo de perfiles, suma de saldos) directamente en el servidor.
2.  **`/admin/lista-alumnos/page.tsx`:**
    *   Usar el cliente de servidor de Supabase para hacer un `fetch` inicial de los perfiles y sus cuentas asociadas: `supabase.from('perfiles').select('*, cuentas(*))'`.
    *   La búsqueda y filtrado se pueden manejar en el cliente o con Server Actions para recargar los datos.
3.  **`/admin/nuevo-alumno/page.tsx`:**
    *   El `handleSubmit` del formulario debe invocar la Edge Function: `supabase.functions.invoke('crear-usuario-cliente', { body: formData })`.
4.  **Añadir Depósitos/Retiros:**
    *   En la `lista-alumnos`, añadir botones en cada fila para "Depositar" y "Retirar".
    *   Estos botones abrirán un modal que pedirá el monto e invocará la Edge Function `gestionar-fondos`.

### 4.3. Implementación del Portal del Cliente
1.  **Crear Rutas del Cliente:**
    *   Crear la estructura `src/app/(cliente)/dashboard` y `src/app/(cliente)/layout.tsx`.
    *   El layout del cliente debe usar el `ClientGuard` para proteger las rutas.
2.  **`/dashboard/page.tsx` (Dashboard del Cliente):**
    *   Será un Server Component (`async`).
    *   Obtendrá los datos de la cuenta del usuario logueado (`supabase.from('cuentas').select('*').eq('usuario_id', user.id)`).
    *   Obtendrá las últimas 10 transacciones (`supabase.from('transacciones')...`).
    *   Pasará estos datos a componentes de cliente para su renderización (Ej: `<BalanceCard saldo={...} />`, `<RecentTransactionsList transactions={...} />`).
3.  **Página de Transferencias (`/dashboard/transferir`):**
    *   Crear un formulario de cliente para la transferencia.
    *   El `handleSubmit` del formulario invocará la Edge Function `iniciar-transferencia-cliente`.
    *   Manejar la UI para estados de carga, éxito y error (ej. "Saldo insuficiente", "Cuenta no encontrada").

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