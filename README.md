# 🏦 Chitibank - Sistema Bancario Educativo

Chitibank es una aplicación web diseñada como una herramienta de educación financiera para colegios de primaria y secundaria. Simula un entorno bancario real de forma segura y controlada, permitiendo a los estudiantes aprender sobre la gestión de cuentas, ahorros y transacciones bajo la supervisión de sus profesores.

## ✨ Funcionalidades

El sistema se divide en dos portales principales: el Panel de Administración para profesores y el Portal del Cliente para estudiantes.

#### Panel de Administración (Profesores)
*   **Dashboard Central:** Visualización de estadísticas clave como el número total de estudiantes, el saldo total del banco y el saldo promedio por cuenta.
*   **Gestión de Estudiantes (CRUD):**
    *   Crear nuevas cuentas para estudiantes con un saldo inicial.
    *   Ver una lista completa y filtrable de todos los estudiantes.
    *   Actualizar la información de los estudiantes.
    *   Eliminar cuentas de estudiantes.
*   **Gestión de Transacciones:** Realizar depósitos y retiros en las cuentas de los estudiantes.

#### Portal del Cliente (Estudiantes)
*   **Dashboard Personal:** Vista clara del saldo actual y un resumen de la actividad reciente.
*   **Historial de Transacciones:** Un registro detallado de todos los depósitos, retiros y transferencias.
*   **Realizar Transferencias:** Enviar dinero a otros estudiantes del mismo banco de forma sencilla y segura.

## 🏗️ Arquitectura y Stack Tecnológico

Chitibank está construido con un stack moderno, serverless y escalable, ideal para un despliegue rápido y un mantenimiento mínimo.

*   **Framework Frontend:** [Next.js](https://nextjs.org/) (con App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **UI/UX:** [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/) para una interfaz minimalista y responsive.
*   **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL) para el almacenamiento de datos relacionales.
*   **Backend:** [Supabase Edge Functions](https://supabase.com/docs/functions) para la lógica de negocio segura y las transacciones.
*   **Autenticación:** [Supabase Auth](https://supabase.com/docs/guides/auth) para la gestión de usuarios y roles.
*   **Despliegue:** [Vercel](https://vercel.com/)

### 🏛️ Estructura Simplificada del Proyecto
```
src/
├── app/
│   ├── (admin)/          # Rutas y lógica para el panel de profesores (protegido)
│   ├── (cliente)/        # Rutas y lógica para el portal de estudiantes (protegido)
│   ├── (auth)/           # Rutas de autenticación (login, registro)
│   └── page.tsx          # Landing page pública
├── lib/
│   ├── supabase/         # Configuración del cliente y tipos de la DB
│   └── utils.ts          # Funciones de utilidad
└── functions/            # Código de las Edge Functions de Supabase
    ├── crear-usuario/
    └── realizar-transaccion/
```

---