# Project Structure

```
banco_ie/
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── export-codebase.py
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── chitibank-logo.jpeg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── refactor.md
├── src
│   ├── app
│   │   ├── (cliente)
│   │   │   ├── dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   └── transferir
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin
│   │   │   ├── configuracion
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── lista-alumnos
│   │   │   │   ├── page-client.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo-alumno
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── drive-scrape
│   │   │       └── route.ts
│   │   ├── auth
│   │   │   ├── auth-code-error
│   │   │   │   └── page.tsx
│   │   │   ├── confirm
│   │   │   │   └── route.ts
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── documentos
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── admin-guard.tsx
│   │   ├── admin-navigation.tsx
│   │   ├── client-guard.tsx
│   │   └── ui
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── table.tsx
│   ├── lib
│   │   ├── supabase
│   │   │   ├── client.ts
│   │   │   ├── database.types.ts
│   │   │   ├── middleware.ts
│   │   │   ├── op_atomicas.db
│   │   │   └── server.ts
│   │   └── utils.ts
│   └── middleware.ts
├── supabase
│   ├── .gitignore
│   ├── .temp
│   │   ├── cli-latest
│   │   ├── gotrue-version
│   │   ├── pooler-url
│   │   ├── postgres-version
│   │   ├── project-ref
│   │   ├── rest-version
│   │   └── storage-version
│   ├── config.toml
│   └── functions
│       ├── _shared
│       │   └── cors.ts
│       ├── crear-usuario-cliente
│       │   └── index.ts
│       ├── gestionar-fondos
│       │   └── index.ts
│       └── iniciar-transferencia-cliente
│           └── index.ts
├── tailwind.config.ts
└── tsconfig.json
```

# Full Codebase

## File: `package.json`
```json
{
  "name": "banco_ie",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.57.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.468.0",
    "next": "15.3.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## File: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "supabase/functions/**"]
}

```

## File: `.env.local`
```local
NEXT_PUBLIC_SUPABASE_URL="TU_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TU_SUPABASE_ANON_KEY"

```

## File: `.gitignore`
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

## File: `eslint.config.mjs`
```mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: ["src/lib/supabase/database.types.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

```

## File: `export-codebase.py`
```py
from pathlib import Path

# Directories to exclude from the export
EXCLUDED_DIRS = {'.git', '__pycache__', '.venv', '.idea', '.mypy_cache', '.vscode', '.github', 'node_modules', 
                '.next', 'out', 'dist', 'coverage', 'README.md','package-lock.json'}

# Important files to include even at the root level
IMPORTANT_CONFIG_FILES = [
    'next.config.mjs', 'next.config.js', 'package.json', 'tsconfig.json', 
    'tailwind.config.js', 'postcss.config.js', '.env.example', '.eslintrc.json'#,
    #'README.md'
]

def build_tree(directory: Path, prefix: str = "") -> list:
    """
    Generates a tree representation of directory structure and files,
    excluding the directories specified in EXCLUDED_DIRS.
    """
    # Filter and sort directory entries
    entries = sorted(
        [entry for entry in directory.iterdir() if entry.name not in EXCLUDED_DIRS],
        key=lambda e: e.name
    )
    tree_lines = []
    for index, entry in enumerate(entries):
        connector = "└── " if index == len(entries) - 1 else "├── "
        tree_lines.append(prefix + connector + entry.name)
        if entry.is_dir():
            extension = "    " if index == len(entries) - 1 else "│   "
            tree_lines.extend(build_tree(entry, prefix + extension))
    return tree_lines

def generate_codebase_markdown(base_path: str = ".", output_file: str = "full_codebase.md"):
    base = Path(base_path).resolve()
    
    lines = []

    # Add directory structure to the beginning of the Markdown file
    lines.append("# Project Structure")
    lines.append("")
    lines.append("```")
    # Start with the project root name
    lines.append(f"{base.name}/")
    tree_lines = build_tree(base)
    lines.extend(tree_lines)
    lines.append("```")
    lines.append("")

    # Add the codebase content in Markdown
    lines.append("# Full Codebase")
    lines.append("")

    # Process all important files at the root level first
    for filename in IMPORTANT_CONFIG_FILES:
        file_path = base / filename
        if file_path.exists() and file_path.is_file():
            rel_path = file_path.relative_to(base)
            lines.append(f"## File: `{rel_path}`")
            try:
                content = file_path.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                lines.append("_[Skipped: binary or non-UTF8 file]_")
                continue
            except Exception as e:
                lines.append(f"_[Error reading file: {e}]_")
                continue
            ext = file_path.suffix.lstrip('.')
            lang = ext if ext else ""
            lines.append(f"```{lang}")
            lines.append(content)
            lines.append("```")
            lines.append("")

    # Process all files in project directories (excluding those in EXCLUDED_DIRS)
    for path in sorted(base.glob("**/*")):
        # Skip excluded directories
        if any(excluded in path.parts for excluded in EXCLUDED_DIRS):
            continue
        
        # Skip already processed root config files
        if path.parent == base and path.name in IMPORTANT_CONFIG_FILES:
            continue
            
        if path.is_file():
            rel_path = path.relative_to(base)
            lines.append(f"## File: `{rel_path}`")
            try:
                content = path.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                lines.append("_[Skipped: binary or non-UTF8 file]_")
                continue
            except Exception as e:
                lines.append(f"_[Error reading file: {e}]_")
                continue
            ext = path.suffix.lstrip('.')
            lang = ext if ext else ""
            lines.append(f"```{lang}")
            lines.append(content)
            lines.append("```")
            lines.append("")

    output_path = base / output_file
    try:
        output_path.write_text("\n".join(lines), encoding='utf-8')
        print(f"✅ Code exported to Markdown at: {output_path}")
    except Exception as e:
        print(f"❌ Error writing output file: {e}")

# If the script is run directly 
if __name__ == "__main__":
    generate_codebase_markdown()
```

## File: `next-env.d.ts`
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

## File: `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

## File: `postcss.config.mjs`
```mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

## File: `public\chitibank-logo.jpeg`
_[Skipped: binary or non-UTF8 file]_
## File: `public\file.svg`
```svg
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

## File: `public\globe.svg`
```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

## File: `public\next.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

## File: `public\vercel.svg`
```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

## File: `public\window.svg`
```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

## File: `refactor.md`
```md
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
```

## File: `src\app\(cliente)\dashboard\page.tsx`
```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatSoles } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Banknote, Clock, DollarSign, Send } from 'lucide-react';

async function getDashboardData(userId: string) {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();

    const { data: cuenta, error: cuentaError } = await supabase
        .from('cuentas')
        .select('*')
        .eq('usuario_id', userId)
        .single();

    if (cuentaError || !cuenta) {
        console.error('Error fetching account data:', cuentaError);
        return { cuenta: null, transacciones: [] };
    }

    const { data: transacciones, error: transaccionesError } = await supabase
        .from('transacciones')
        .select('*')
        .or(`cuenta_origen_id.eq.${cuenta.id},cuenta_destino_id.eq.${cuenta.id}`)
        .order('fecha', { ascending: false })
        .limit(10);

    if (transaccionesError) {
        console.error('Error fetching transactions:', transaccionesError);
    }

    return {
        cuenta,
        transacciones: transacciones || [],
    };
}

export default async function DashboardPage() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/auth/login');
    }

    const { cuenta, transacciones } = await getDashboardData(user.id);

    if (!cuenta) {
        return (
            <div className="text-center p-4">
                <h2 className="text-xl font-semibold">No se encontró una cuenta asociada.</h2>
                <p>Por favor, contacte a un administrador.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Hola, {user.user_metadata.nombre_completo || 'Estudiante'}
                </h1>
                <p className="text-gray-600">
                    Bienvenido a tu portal financiero.
                </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Saldo Actual</span>
                        <DollarSign className="h-6 w-6" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{formatSoles(cuenta.saldo_actual)}</p>
                    <p className="text-sm opacity-80">Número de cuenta: {cuenta.numero_cuenta}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Send className="h-5 w-5 mr-2 text-blue-500" />
                            Realizar una Transferencia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Envía dinero a otros compañeros de forma rápida y segura.</p>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/transferir">
                                Nueva Transferencia <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Banknote className="h-5 w-5 mr-2 text-green-500" />
                            Ver todos mis movimientos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Consulta el historial completo de tus transacciones.</p>
                        <Button variant="outline" className="w-full" disabled>
                            Ver Historial Completo <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        Actividad Reciente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transacciones.length > 0 ? transacciones.map(t => (
                            <div key={t.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold capitalize">{t.tipo}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.fecha).toLocaleString('es-PE')}</p>
                                </div>
                                <p className={`font-bold ${t.cuenta_destino_id === cuenta.id ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.cuenta_destino_id === cuenta.id ? '+' : '-'} {formatSoles(t.monto)}
                                </p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No hay transacciones recientes.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```

## File: `src\app\(cliente)\dashboard\transferir\page.tsx`
```tsx
"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TransferPage() {
    const router = useRouter();
    const [numeroCuentaDestino, setNumeroCuentaDestino] = useState('');
    const [monto, setMonto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!numeroCuentaDestino || !monto || parseFloat(monto) <= 0) {
            setError('Por favor, ingrese un número de cuenta y un monto válidos.');
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();
            
            const { data, error: functionError } = await supabase.functions.invoke('iniciar-transferencia-cliente', {
                body: {
                    numero_cuenta_destino: numeroCuentaDestino,
                    monto: parseFloat(monto),
                },
            });

            if (functionError) {
                const errorMessage = functionError.context?.msg ?? functionError.message;
                throw new Error(errorMessage);
            }
            
            if (data?.error) {
                throw new Error(data.error);
            }

            setSuccess('¡Transferencia realizada con éxito!');
            setNumeroCuentaDestino('');
            setMonto('');

            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 2000);

        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Transferencia</CardTitle>
                    <CardDescription>Envía dinero a otra cuenta de Chitibank.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="numero-cuenta">Número de Cuenta de Destino</Label>
                            <Input
                                id="numero-cuenta"
                                type="text"
                                placeholder="Ej: 1234567890"
                                value={numeroCuentaDestino}
                                onChange={(e) => setNumeroCuentaDestino(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="monto">Monto a Transferir (S/.)</Label>
                            <Input
                                id="monto"
                                type="number"
                                placeholder="Ej: 50.00"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                disabled={loading}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert variant="default" className="bg-green-100 border-green-400 text-green-700">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Éxito</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Realizar Transferencia'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
```

## File: `src\app\(cliente)\layout.tsx`
```tsx
import ClientGuard from "@/components/client-guard";

export default function ClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientGuard>{children}</ClientGuard>;
}

```

## File: `src\app\admin\configuracion\page.tsx`
```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Panel de Configuración
                    </CardTitle>
                    <CardDescription>
                        Esta sección está en construcción. Aquí podrás gestionar la configuración general del banco escolar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}
```

## File: `src\app\admin\layout.tsx`
```tsx
import AdminGuard from '@/components/admin-guard';
import { AdminNavigation } from '@/components/admin-navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

```

## File: `src\app\admin\lista-alumnos\page-client.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatSoles } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Search, DollarSign, Edit, Trash2, AlertTriangle, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Alumno = {
    id: string;
    nombre: string;
    fechaCreacion: string;
    cuentaId: string;
    saldo: number;
};

type AlumnosClientProps = {
    initialAlumnos: Alumno[];
};

export default function AlumnosClient({ initialAlumnos }: AlumnosClientProps) {
    const [alumnos] = useState(initialAlumnos);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
    const [modal, setModal] = useState<'edit' | 'delete' | 'transaction' | null>(null);
    const [editForm, setEditForm] = useState({ nombre: '' });
    const [transactionForm, setTransactionForm] = useState({ tipo: 'deposito' as 'deposito' | 'retiro', monto: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();
    const router = useRouter();

    const filteredAlumnos = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (type: 'edit' | 'delete' | 'transaction', alumno: Alumno) => {
        setSelectedAlumno(alumno);
        if (type === 'edit') setEditForm({ nombre: alumno.nombre });
        if (type === 'transaction') setTransactionForm({ tipo: 'deposito', monto: '' });
        setError('');
        setModal(type);
    };

    const handleUpdate = async () => {
        if (!selectedAlumno || !editForm.nombre.trim()) return;
        setIsSubmitting(true);
        const { error } = await supabase.from('perfiles').update({ nombre_completo: editForm.nombre.trim() }).eq('id', selectedAlumno.id);
        if (!error) {
            router.refresh();
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    const confirmDelete = async () => {
        if (!selectedAlumno) return;
        setIsSubmitting(true);
        // Debe ser una Edge Function por seguridad
        const { error } = await supabase.functions.invoke('borrar-usuario-cliente', { body: { userId: selectedAlumno.id } });
        if (!error) {
            router.refresh();
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    const confirmTransaction = async () => {
        if (!selectedAlumno || !transactionForm.monto) return;
        const monto = parseFloat(transactionForm.monto);
        if (isNaN(monto) || monto <= 0) {
            setError("Monto inválido."); return;
        }
        setIsSubmitting(true);
        const { error } = await supabase.functions.invoke('gestionar-fondos', {
            body: { tipo: transactionForm.tipo, cuenta_id: selectedAlumno.cuentaId, monto },
        });
        if (!error) {
            router.refresh();
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Búsqueda de Alumnos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Estudiantes ({filteredAlumnos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Saldo</TableHead>
                                <TableHead>Fecha de Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlumnos.map((alumno) => (
                                <TableRow key={alumno.id}>
                                    <TableCell className="font-medium">{alumno.nombre}</TableCell>
                                    <TableCell>{formatSoles(alumno.saldo)}</TableCell>
                                    <TableCell>{new Date(alumno.fechaCreacion).toLocaleDateString('es-PE')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openModal('transaction', alumno)}><DollarSign className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={() => openModal('edit', alumno)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => openModal('delete', alumno)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modals */}
            <Dialog open={!!modal} onOpenChange={(isOpen) => !isOpen && setModal(null)}>
                <DialogContent>
                    {modal === 'edit' && <>
                        <DialogHeader><DialogTitle>Editar Alumno</DialogTitle></DialogHeader>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <Label htmlFor="edit-nombre">Nombre</Label>
                        <Input id="edit-nombre" value={editForm.nombre} onChange={(e) => setEditForm({ nombre: e.target.value })} />
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={handleUpdate} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar</Button></DialogFooter>
                    </>}
                    {modal === 'delete' && <>
                        <DialogHeader><DialogTitle className="flex items-center"><AlertTriangle className="text-red-500 mr-2" />Confirmar Eliminación</DialogTitle></DialogHeader>
                        <DialogDescription>¿Seguro que deseas eliminar a <strong>{selectedAlumno?.nombre}</strong>? Esta acción no se puede deshacer.</DialogDescription>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Eliminar</Button></DialogFooter>
                    </>}
                    {modal === 'transaction' && <>
                        <DialogHeader><DialogTitle>Operación para {selectedAlumno?.nombre}</DialogTitle><DialogDescription>Saldo actual: {formatSoles(selectedAlumno?.saldo ?? 0)}</DialogDescription></DialogHeader>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <div className="flex gap-2"><Button variant={transactionForm.tipo === 'deposito' ? 'default' : 'outline'} onClick={() => setTransactionForm(prev => ({ ...prev, tipo: 'deposito' }))} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Depósito</Button><Button variant={transactionForm.tipo === 'retiro' ? 'default' : 'outline'} onClick={() => setTransactionForm(prev => ({ ...prev, tipo: 'retiro' }))} className="flex-1"><MinusCircle className="mr-2 h-4 w-4" />Retiro</Button></div>
                        <div><Label htmlFor="monto">Monto (S/)</Label><Input id="monto" type="number" placeholder="0.00" value={transactionForm.monto} onChange={(e) => setTransactionForm(prev => ({ ...prev, monto: e.target.value }))} /></div>
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={confirmTransaction} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirmar</Button></DialogFooter>
                    </>}
                </DialogContent>
            </Dialog>
        </div>
    );
}
```

## File: `src\app\admin\lista-alumnos\page.tsx`
```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

type AlumnoConCuenta = {
    id: string;
    nombre_completo: string;
    fecha_creacion: string;
    cuentas: {
        id: string;
        saldo_actual: number;
    }[];
};

async function getAlumnos() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('perfiles')
        .select(`id, nombre_completo, fecha_creacion, cuentas(id, saldo_actual)`)
        .eq('rol', 'cliente')
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }

    const typedData = data as AlumnoConCuenta[];
    
    return typedData.map(perfil => ({
        id: perfil.id,
        nombre: perfil.nombre_completo,
        fechaCreacion: perfil.fecha_creacion,
        cuentaId: perfil.cuentas[0]?.id ?? '',
        saldo: perfil.cuentas[0]?.saldo_actual ?? 0,
    }));
}

export default async function ListaAlumnosPage() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const alumnos = await getAlumnos();
    return <AlumnosClient initialAlumnos={alumnos} />;
}
```

## File: `src\app\admin\nuevo-alumno\page.tsx`
```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import deferred in handler to avoid prerender env usage
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    montoInicial: '0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El formato del email no es válido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    const monto = parseFloat(formData.montoInicial);
    if (isNaN(monto) || monto < 0) newErrors.montoInicial = 'El monto debe ser un número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke('crear-usuario-cliente', {
        body: {
          nombre_completo: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password,
          saldo_inicial: parseFloat(formData.montoInicial),
        },
      });
      if (error) throw new Error(data?.error || error.message);
      setShowSuccess(true);
      setTimeout(() => router.push('/admin/lista-alumnos'), 2000);
    } catch (err) {
      const error = err as Error;
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="bg-green-500 text-white p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-green-800">¡Alumno Registrado!</CardTitle>
            <CardDescription className="text-green-700">El estudiante ha sido añadido exitosamente.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">Redirigiendo a la lista de alumnos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-chiti_bank-blue">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/lista-alumnos" className="hover:text-chiti_bank-blue">Lista de Alumnos</Link>
        <span>/</span>
        <span className="font-medium text-chiti_bank-blue">Nuevo Alumno</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><UserPlus className="mr-2" /> Registrar Nuevo Alumno</CardTitle>
          <CardDescription>Completa los datos para crear una nueva cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} className={errors.nombre ? 'border-red-500' : ''} />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'border-red-500' : ''} />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (S/.)</Label>
              <Input id="montoInicial" name="montoInicial" type="number" min="0" step="0.01" value={formData.montoInicial} onChange={handleInputChange} className={errors.montoInicial ? 'border-red-500' : ''} />
              {errors.montoInicial && <p className="text-sm text-red-600">{errors.montoInicial}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" asChild><Link href="/admin/lista-alumnos">Cancelar</Link></Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Registrando...' : 'Registrar Alumno'}
              </Button>
            </div>
          </form>

        </CardContent>
      </Card>

    </div>
  );
}
```

## File: `src\app\admin\page.tsx`
```tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { formatSoles } from '@/lib/utils';
import { Users, UserPlus, Banknote, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/supabase/database.types';

type Profile = Database['public']['Tables']['perfiles']['Row'];
type Account = Database['public']['Tables']['cuentas']['Row'];
type ProfileWithAccount = Profile & {
    cuentas: Pick<Account, 'saldo_actual'>[];
};

async function getStats() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { count, error: countError } = await supabase
      .from('perfiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'cliente');

    if (countError) console.error("Error fetching students count:", countError);

    const { data: accounts, error: balanceError } = await supabase.from('cuentas').select('saldo_actual');
    if (balanceError) console.error("Error fetching balances:", balanceError);
    
    const totalBalance = accounts?.reduce((acc, curr) => acc + (curr.saldo_actual ?? 0), 0) ?? 0;
    
    return {
        totalStudents: count ?? 0,
        totalBalance: totalBalance,
    };
}

async function getRecentStudents() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('perfiles')
        .select(`id, nombre_completo, fecha_creacion, cuentas(saldo_actual)`)
        .eq('rol', 'cliente')
        .order('fecha_creacion', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching recent students:", error);
        return [];
    }
    
    const typedData = data as ProfileWithAccount[];

    return typedData.map(profile => ({
        id: profile.id,
        nombre: profile.nombre_completo,
        fechaCreacion: profile.fecha_creacion,
        saldo: profile.cuentas[0]?.saldo_actual ?? 0,
    }));
}

export default async function AdminDashboard() {
  // CORRECCIÓN: Se debe usar await para el cliente de servidor
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { totalStudents, totalBalance } = await getStats();
  const recentStudents = await getRecentStudents();
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const statsCards = [
    { title: 'Total de Alumnos', value: totalStudents.toString(), icon: Users, color: 'text-chiti_bank-blue', bgColor: 'bg-blue-50' },
    { title: 'Saldo Total', value: formatSoles(totalBalance), icon: DollarSign, color: 'text-chiti_bank-green', bgColor: 'bg-green-50' },
    { title: 'Saldo Promedio', value: formatSoles(averageBalance), icon: TrendingUp, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Supervisa las cuentas y la actividad del banco escolar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><UserPlus className="h-6 w-6 mr-3 text-chiti_bank-blue" />Registrar Alumno</CardTitle>
            <CardDescription>Añade un nuevo estudiante al sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/nuevo-alumno">Nuevo Alumno <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="h-6 w-6 mr-3 text-chiti_bank-green" />Gestionar Alumnos</CardTitle>
            <CardDescription>Consulta, edita y realiza operaciones en las cuentas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/admin/lista-alumnos">Ver Lista Completa <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Banknote className="h-5 w-5 mr-2" />Estudiantes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{student.nombre}</p>
                    <p className="text-sm text-gray-500">Registrado: {new Date(student.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-chiti_bank-green">{formatSoles(student.saldo)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No hay estudiantes registrados aún.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## File: `src\app\api\drive-scrape\route.ts`
```ts
import { NextResponse } from 'next/server';

type Item = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parent?: string | null;
  href?: string;
};

async function scrapeFolderOnce(folderId: string) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!resp.ok) {
    throw new Error(`Failed to fetch folder ${folderId}: ${resp.status}`);
  }
  const text = await resp.text();

  const items: Item[] = [];

  // Find anchors; filter file and folder links
  const anchorRe = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gmi;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = anchorRe.exec(text)) !== null) {
    const href = m[1];
    let label = m[2].replace(/<[^>]+>/g, '').trim();
    if (!label) label = '';

    // File link pattern
    const fileMatch = href.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
    if (fileMatch) {
      const id = fileMatch[1];
      if (seen.has(`f:${id}`)) continue;
      seen.add(`f:${id}`);
      items.push({ id, name: label || id, type: 'file', parent: folderId, href });
      continue;
    }

    // Folder link pattern
    const folderMatch = href.match(/\/drive\/folders\/([A-Za-z0-9_-]+)/);
    if (folderMatch) {
      const id = folderMatch[1];
      if (seen.has(`d:${id}`)) continue;
      seen.add(`d:${id}`);
      items.push({ id, name: label || id, type: 'folder', parent: folderId, href });
      continue;
    }
  }

  return items;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const root = searchParams.get('folderId');
    if (!root) return NextResponse.json({ error: 'folderId query param is required' }, { status: 400 });

    const maxItems = 2000; // safety cap
    const queue: string[] = [root];
    const results: Item[] = [];
    const visited = new Set<string>();

    while (queue.length > 0 && results.length < maxItems) {
      const folderId = queue.shift() as string;
      if (visited.has(folderId)) continue;
      visited.add(folderId);
      try {
        const items = await scrapeFolderOnce(folderId);
        for (const it of items) {
          results.push(it);
          if (it.type === 'folder' && !visited.has(it.id)) {
            queue.push(it.id);
          }
          if (results.length >= maxItems) break;
        }
      } catch {
        // ignore folder errors but record a placeholder
        results.push({ id: folderId, name: `__error_loading_${folderId}__`, type: 'folder', parent: null });
      }
    }

    return NextResponse.json({ items: results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

```

## File: `src\app\auth\auth-code-error\page.tsx`
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Error de Autenticación</CardTitle>
          <CardDescription>
            El enlace de confirmación no es válido o ha expirado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Por favor, intenta registrarte de nuevo o contacta al soporte si el problema persiste.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-md bg-chiti_bank-blue px-4 py-2 text-sm font-medium text-white hover:bg-chiti_bank-blue/90"
          >
            Volver a Iniciar Sesión
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

```

## File: `src\app\auth\confirm\route.ts`
```ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // redirect the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}

```

## File: `src\app\auth\login\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Check user role after successful login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError("No se pudo verificar el rol del usuario.");
          setLoading(false);
        } else if (profile) {
          if (profile.rol === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard'); // Assuming client route is /dashboard
          }
        }
      } else {
        setError("No se pudo obtener la información del usuario.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-chiti_bank-blue hover:text-chiti_bank-blue/80 transition-colors">
            <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ChitiBank</h1>
              <p className="text-sm text-gray-600">Banco Escolar</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl text-chiti_bank-blue">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta de ChitiBank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button type="submit" className="w-full" variant="chiti_bank" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/auth/register" className="text-chiti_bank-blue hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-chiti_bank-blue transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

```

## File: `src\app\auth\register\page.tsx`
```tsx
'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('perfiles')
        .insert({ 
            id: data.user.id, 
            nombre_completo: formData.fullName, 
            rol: 'cliente' // All public registrations are 'cliente'
        });

      if (profileError) {
        setError(`Error al crear el perfil: ${profileError.message}`);
        // Consider deleting the auth user if profile creation fails to avoid orphaned users
        await supabase.auth.admin.deleteUser(data.user.id);
      } else {
        setSuccess('¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta.');
        // Clear form
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-chiti_bank-blue hover:text-chiti_bank-blue/80 transition-colors">
            <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ChitiBank</h1>
              <p className="text-sm text-gray-600">Banco Escolar</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl text-chiti_bank-blue">Crear Cuenta de Estudiante</CardTitle>
            <CardDescription>
              Regístrate para obtener tu cuenta en ChitiBank.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nombre del Estudiante"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="estudiante@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-center">{success}</p>}

              <Button type="submit" className="w-full" variant="chiti_bank" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-chiti_bank-blue hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-chiti_bank-blue transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

```

## File: `src\app\documentos\page.tsx`
```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type Item = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parent?: string | null;
  href?: string;
};

export default function DocumentosPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  // Root folder provided by the user
  const ROOT_FOLDER = '1D75tarMF-L1ImsWw4XT00bpb4O8OcCLw';

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/drive-scrape?folderId=${ROOT_FOLDER}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Error fetching');
        setItems(json.items || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const openPreview = (it: Item) => {
    // Only attempt to preview files (not folders)
    if (it.type === 'folder') return window.open(`https://drive.google.com/drive/folders/${it.id}`, '_blank', 'noopener');

    // Infer preview URL by file ID and simple heuristics (PDF/images use file preview)
    const previewUrl = `https://drive.google.com/file/d/${it.id}/preview`;
    setPreviewSrc(previewUrl);
    setPreviewName(it.name);
  };

  const closePreview = () => {
    setPreviewSrc(null);
    setPreviewName(null);
  };

  const folders = items.filter(i => i.type === 'folder');
  const files = items.filter(i => i.type === 'file');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repositorio de Documentos</h1>
            <p className="text-gray-600">Accede y previsualiza recursos de la carpeta raíz de Drive (lectura pública mediante scraping).</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
            <a href={`https://drive.google.com/drive/folders/${ROOT_FOLDER}`} target="_blank" rel="noreferrer">
              <Button variant="chiti_bank">Abrir carpeta raíz en Drive</Button>
            </a>
          </div>
        </header>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Carpetas ({folders.length})</h2>
            <div className="text-sm text-muted-foreground">Archivos encontrados: {files.length}</div>
          </div>

          {loading && <div className="text-gray-600">Escaneando carpeta raíz, por favor espera...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {folders.map((f) => (
              <Card key={`d-${f.id}`} className="border-2 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-chiti_bank-blue">{f.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Carpeta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">ID: {f.id}</div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={() => window.open(`https://drive.google.com/drive/folders/${f.id}`, '_blank', 'noopener')}>Abrir carpeta</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Archivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.map((it) => (
                <Card key={`f-${it.id}`} className="border-2 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-chiti_bank-blue">{it.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Archivo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">ID: {it.id}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="chiti_bank" onClick={() => openPreview(it)}>Ver</Button>
                        <a href={`https://drive.google.com/file/d/${it.id}/view`} target="_blank" rel="noreferrer">
                          <Button variant="outline">Abrir en Drive</Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewSrc} onOpenChange={(open) => { if (!open) closePreview(); }}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{previewName ?? 'Previsualización'}</DialogTitle>
              <DialogDescription>Vista previa del recurso. Si el archivo no se puede embeber, se abrirá en Drive.</DialogDescription>
            </DialogHeader>

            <div className="h-[70vh]">
              {previewSrc ? (
                <iframe title="drive-preview" src={previewSrc} className="w-full h-full border rounded-md" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay archivo seleccionado</div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closePreview}>Cerrar</Button>
              {previewSrc && (
                <a href={previewSrc.replace('/preview', '/view')} target="_blank" rel="noreferrer">
                  <Button variant="chiti_bank">Abrir en Drive</Button>
                </a>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\favicon.ico`
_[Skipped: binary or non-UTF8 file]_
## File: `src\app\globals.css`
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 84% 4.9%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;

  /* ChitiBank Custom Variables */
    --chiti_bank-blue: 225 100% 20%; /* #1e3a8a */
    --chiti_bank-green: 142 76% 36%; /* #16a34a */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}

/* ChitiBank Custom Utility Classes */
.bg-chiti_bank-blue {
  background-color: #1e3a8a !important;
}

.text-chiti_bank-blue {
  color: #1e3a8a !important;
}

.bg-chiti_bank-green {
  background-color: #16a34a !important;
}

.text-chiti_bank-green {
  color: #16a34a !important;
}

.hover\:bg-chiti_bank-blue\/90:hover {
  background-color: rgba(30, 58, 138, 0.9) !important;
}

.hover\:bg-chiti_bank-green\/90:hover {
  background-color: rgba(22, 163, 74, 0.9) !important;
}

.hover\:text-chiti_bank-blue:hover {
  color: #1e3a8a !important;
}

.border-chiti_bank-blue {
  border-color: #1e3a8a !important;
}

.border-chiti_bank-green {
  border-color: #16a34a !important;
}

.hover\:border-chiti_bank-blue:hover {
  border-color: #1e3a8a !important;
}

.hover\:border-chiti_bank-green:hover {
  border-color: #16a34a !important;
}

```

## File: `src\app\layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chitibank - Banco Escolar",
  description: "Una herramienta de educación financiera para colegios de primaria y secundaria.",
  keywords: "banco escolar, educación financiera, Chitibank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

```

## File: `src\app\page.tsx`
```tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="max-w-4xl">
          <Image 
            src="/chitibank-logo.jpeg" 
            alt="ChitiBank Logo" 
            width={96}
            height={96}
            className="h-24 w-auto mx-auto mb-6 rounded-full shadow-md"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Bienvenido a{" "}
            <span className="text-chiti_bank-blue">ChitiBank</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El primer banco escolar que enseña a los estudiantes sobre educación financiera 
            de manera práctica y divertida. Aprende a ahorrar, gestionar dinero y 
            desarrollar hábitos financieros saludables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="chiti_bank" asChild>
              <Link href="/auth/register">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/documentos">Repositorio de Documentos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Acceso Administrativo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir ChitiBank?
            </h2>
            <p className="text-xl text-gray-600">
              Una plataforma diseñada específicamente para la educación financiera estudiantil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-chiti_bank-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-blue">Educación Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Aprende conceptos financieros a través de experiencias reales de ahorro y gestión de dinero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chiti_bank-green transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-green text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-green">Seguro y Confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Plataforma segura diseñada específicamente para el entorno educativo escolar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chiti_bank-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-blue">Gestión Sencilla</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Interface intuitiva que permite a profesores y estudiantes gestionar cuentas fácilmente.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-chiti_bank-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu educación financiera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de estudiantes que ya están aprendiendo sobre finanzas con ChitiBank
          </p>
          <Button size="lg" variant="chiti_bankGreen" asChild>
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
                <Image src="/chitibank-logo.jpeg" alt="ChitiBank Logo" width={32} height={32} className="h-8 w-auto" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ChitiBank</h3>
                <p className="text-sm text-gray-400">Educación financiera escolar</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 ChitiBank. Proyecto educativo sin fines comerciales.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

```

## File: `src\components\admin-guard.tsx`
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error || !profile || profile.rol !== 'admin') {
        // Redirect to login or an unauthorized page if not an admin
        router.replace('/auth/login');
      } else {
        setIsAuthorized(true);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (!isAuthorized) {
    // You can show a loading spinner here while checking the session
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verificando acceso de administrador...</p>
      </div>
    );
  }

  return <>{children}</>;
}

```

## File: `src\components\admin-navigation.tsx`
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, LogOut, Settings } from "lucide-react"; // Cambiado Landmark por Settings
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const links = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: Home,
        },
        {
            href: "/admin/lista-alumnos",
            label: "Alumnos",
            icon: Users,
        },
        {
            href: "/admin/configuracion",
            label: "Configuración",
            icon: Settings,
        },
    ];

    return (
        <aside className="w-64" aria-label="Sidebar">
            <div className="px-3 py-4 overflow-y-auto rounded bg-gray-800 h-full flex flex-col min-h-screen">
                <Link
                    href="/admin"
                    className="flex items-center pl-2.5 mb-5"
                >
                    <Image
                        src="/chitibank-logo.jpeg"
                        width={32}
                        height={32}
                        className="h-8 w-8 mr-3 rounded-md"
                        alt="ChitiBank Logo"
                    />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                        ChitiBank
                    </span>
                </Link>
                <nav className="space-y-2 flex-grow">
                    {links.map((link) => (
                        <Link
                            key={link.href} // CORRECCIÓN: Añadida la prop key
                            href={link.href}
                            className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors group ${
                                pathname.startsWith(link.href) && (link.href !== "/admin" || pathname === "/admin")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-gray-700">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-left text-gray-300 hover:bg-red-600 hover:text-white"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </aside>
    );
}
```

## File: `src\components\client-guard.tsx`
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error || !profile || profile.rol !== 'cliente') {
        // Redirect to login or an unauthorized page if not a client
        router.replace('/auth/login'); 
      } else {
        setIsAuthorized(true);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (!isAuthorized) {
    // You can show a loading spinner here while checking the session
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Verificando acceso...</p>
        </div>
    );
  }

  return <>{children}</>;
}

```

## File: `src\components\ui\alert.tsx`
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

```

## File: `src\components\ui\button.tsx`
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        chiti_bank: "bg-chiti_bank-blue text-white shadow hover:bg-chiti_bank-blue/90",
        chiti_bankGreen: "bg-chiti_bank-green text-white shadow hover:bg-chiti_bank-green/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

## File: `src\components\ui\card.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

## File: `src\components\ui\dialog.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      
      {/* Dialog Content */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 max-w-lg w-full mx-4 bg-background rounded-lg shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
})
Dialog.displayName = "Dialog"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6", className)}
    {...props}
  >
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

## File: `src\components\ui\input.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

```

## File: `src\components\ui\label.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }

```

## File: `src\components\ui\table.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

## File: `src\lib\supabase\client.ts`
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

```

## File: `src\lib\supabase\database.types.ts`
_[Skipped: binary or non-UTF8 file]_
## File: `src\lib\supabase\middleware.ts`
```ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

## File: `src\lib\supabase\op_atomicas.db`
```db
-- Función para realizar transferencias de manera segura y atómica
CREATE OR REPLACE FUNCTION public.realizar_transferencia(
    cuenta_origen_id_param UUID,
    numero_cuenta_destino_param TEXT,
    monto_param NUMERIC
)
RETURNS VOID AS $$
DECLARE
    cuenta_destino_id_var UUID;
    saldo_origen_actual NUMERIC;
    nombre_origen_var TEXT;
    nombre_destino_var TEXT;
BEGIN
    -- Validar que quien ejecuta es el dueño de la cuenta de origen
    IF NOT EXISTS (SELECT 1 FROM public.cuentas WHERE id = cuenta_origen_id_param AND usuario_id = auth.uid()) THEN
        RAISE EXCEPTION 'Permiso denegado: No eres el dueño de la cuenta de origen.';
    END IF;

    -- Obtener datos de la cuenta destino y bloquear la fila para evitar concurrencia
    SELECT c.id, p.nombre_completo INTO cuenta_destino_id_var, nombre_destino_var
    FROM public.cuentas c JOIN public.perfiles p ON c.usuario_id = p.id
    WHERE c.numero_cuenta = numero_cuenta_destino_param FOR UPDATE;
    
    IF cuenta_destino_id_var IS NULL THEN
        RAISE EXCEPTION 'La cuenta de destino no existe.';
    END IF;

    IF cuenta_destino_id_var = cuenta_origen_id_param THEN
        RAISE EXCEPTION 'No se puede transferir a la misma cuenta.';
    END IF;

    -- Obtener saldo de origen y bloquear la fila
    SELECT c.saldo_actual, p.nombre_completo INTO saldo_origen_actual, nombre_origen_var
    FROM public.cuentas c JOIN public.perfiles p ON c.usuario_id = p.id
    WHERE c.id = cuenta_origen_id_param FOR UPDATE;
    
    IF saldo_origen_actual < monto_param THEN
        RAISE EXCEPTION 'Saldo insuficiente.';
    END IF;
    
    -- Realizar las operaciones de actualización de saldos
    UPDATE public.cuentas SET saldo_actual = saldo_actual - monto_param WHERE id = cuenta_origen_id_param;
    UPDATE public.cuentas SET saldo_actual = saldo_actual + monto_param WHERE id = cuenta_destino_id_var;
    
    -- Registrar ambas transacciones para el historial de cada usuario
    INSERT INTO public.transacciones(cuenta_origen_id, cuenta_destino_id, monto, tipo, descripcion)
    VALUES (cuenta_origen_id_param, cuenta_destino_id_var, monto_param, 'transferencia_enviada', 'Envío a ' || nombre_destino_var);

    INSERT INTO public.transacciones(cuenta_origen_id, cuenta_destino_id, monto, tipo, descripcion)
    VALUES (cuenta_origen_id_param, cuenta_destino_id_var, monto_param, 'transferencia_recibida', 'Recibido de ' || (SELECT p.nombre_completo FROM cuentas c JOIN perfiles p ON c.usuario_id = p.id WHERE c.id = cuenta_origen_id_param));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## File: `src\lib\supabase\server.ts`
```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

```

## File: `src\lib\utils.ts`
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSoles(amount: number): string {
  if (typeof amount !== 'number') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(0);
  }
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
}
```

## File: `src\middleware.ts`
```ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

```

## File: `supabase\.gitignore`
```
# Supabase
.branches
.temp

# dotenvx
.env.keys
.env.local
.env.*.local

```

## File: `supabase\.temp\cli-latest`
```
v2.39.2
```

## File: `supabase\.temp\gotrue-version`
```
v2.179.0
```

## File: `supabase\.temp\pooler-url`
```
postgresql://postgres.vimimyacwnhuiywgwwup:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## File: `supabase\.temp\postgres-version`
```
17.4.1.064
```

## File: `supabase\.temp\project-ref`
```
vimimyacwnhuiywgwwup
```

## File: `supabase\.temp\rest-version`
```
v12.2.12
```

## File: `supabase\.temp\storage-version`
```
v1.26.4
```

## File: `supabase\config.toml`
```toml
# For detailed configuration reference documentation, visit:
# https://supabase.com/docs/guides/local-development/cli/config
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "banco_ie"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` and `graphql_public` schemas are included by default.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[api.tls]
# Enable HTTPS endpoints locally using a self-signed certificate.
enabled = false

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 15

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

# [db.vault]
# secret_key = "env(SECRET_VALUE)"

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory: "./seeds/*.sql"
sql_paths = ["./seed.sql"]

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326
# admin_email = "admin@email.com"
# sender_name = "Admin"

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

# Image transformation API is available to Supabase Pro plan.
# [storage.image_transformation]
# enabled = true

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:3000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false
# Passwords shorter than this value will be rejected as weak. Minimum 6, recommended 8 or more.
minimum_password_length = 6
# Passwords that do not meet the following requirements will be rejected as weak. Supported values
# are: `letters_digits`, `lower_upper_letters_digits`, `lower_upper_letters_digits_symbols`
password_requirements = ""

# Configure one of the supported captcha providers: `hcaptcha`, `turnstile`.
# [auth.captcha]
# enabled = true
# provider = "hcaptcha"
# secret = ""

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# enabled = true
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }}"
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# [auth.sms.test_otp]
# 4152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

# Multi-factor-authentication is available to Supabase Pro plan.
[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = false
verify_enabled = false

# Configure MFA via Phone Messaging
[auth.mfa.phone]
enroll_enabled = false
verify_enabled = false
otp_length = 6
template = "Your code is {{ .Code }}"
max_frequency = "5s"

# Configure MFA via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `slack`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth redirectUrl.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false

# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

[edge_runtime]
enabled = true
# Configure one of the supported request policies: `oneshot`, `per_worker`.
# Use `oneshot` for hot reload, or `per_worker` for load testing.
policy = "oneshot"
# Port to attach the Chrome inspector for debugging edge functions.
inspector_port = 8083

# Use these configurations to customize your Edge Function.
# [functions.MY_FUNCTION_NAME]
# enabled = true
# verify_jwt = true
# import_map = "./functions/MY_FUNCTION_NAME/deno.json"
# Uncomment to specify a custom file path to the entrypoint.
# Supported file extensions are: .ts, .js, .mjs, .jsx, .tsx
# entrypoint = "./functions/MY_FUNCTION_NAME/index.ts"
# Specifies static files to be bundled with the function. Supports glob patterns.
# For example, if you want to serve static HTML pages in your function:
# static_files = [ "./functions/MY_FUNCTION_NAME/*.html" ]

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures Postgres storage engine to use OrioleDB (S3)
orioledb_version = ""
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"

```

## File: `supabase\functions\_shared\cors.ts`
```ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

```

## File: `supabase\functions\crear-usuario-cliente\index.ts`
```ts
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Función para generar un número de cuenta único de 10 dígitos
function generarNumeroCuenta() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { nombre_completo, email, password, saldo_inicial } = await req.json();

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { nombre_completo: nombre_completo }
    });
    if (authError) throw authError;
    const user = authData.user;
    if (!user) throw new Error("La creación del usuario en Auth falló.");

    // 2. Crear perfil
    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .insert({ id: user.id, nombre_completo: nombre_completo, rol: 'cliente' });
    if (perfilError) throw perfilError;

    // 3. Crear cuenta bancaria
    const numero_cuenta = generarNumeroCuenta();
    const { data: cuentaData, error: cuentaError } = await supabaseAdmin
      .from('cuentas')
      .insert({ usuario_id: user.id, saldo_actual: saldo_inicial, numero_cuenta: numero_cuenta })
      .select('id')
      .single();
    if (cuentaError || !cuentaData) throw cuentaError || new Error("Fallo al crear la cuenta bancaria.");

    // 4. Registrar depósito inicial si es mayor a cero
    if (saldo_inicial > 0) {
      const { error: transaccionError } = await supabaseAdmin
        .from('transacciones')
        .insert({
          cuenta_destino_id: cuentaData.id,
          monto: saldo_inicial,
          tipo: 'deposito',
          descripcion: 'Depósito inicial de cuenta'
        });
      if (transaccionError) throw transaccionError;
    }

    return new Response(JSON.stringify({ userId: user.id, message: "Usuario y cuenta creados exitosamente." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    console.error("Error en Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

## File: `supabase\functions\gestionar-fondos\index.ts`
```ts
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // TODO: Implementar verificación de que quien llama es un admin

    const { tipo, cuenta_id, monto } = await req.json();
    if (monto <= 0) throw new Error("El monto debe ser positivo.");

    const { data: cuenta, error: cuentaError } = await supabaseAdmin
      .from('cuentas')
      .select('saldo_actual')
      .eq('id', cuenta_id)
      .single();
    if (cuentaError) throw new Error("Cuenta no encontrada.");

    let nuevoSaldo;
    if (tipo === 'deposito') {
      nuevoSaldo = cuenta.saldo_actual + monto;
    } else if (tipo === 'retiro') {
      if (cuenta.saldo_actual < monto) throw new Error("Saldo insuficiente.");
      nuevoSaldo = cuenta.saldo_actual - monto;
    } else {
      throw new Error("Tipo de operación no válido.");
    }

    // Actualizar saldo
    const { error: updateError } = await supabaseAdmin
      .from('cuentas')
      .update({ saldo_actual: nuevoSaldo })
      .eq('id', cuenta_id);
    if (updateError) throw updateError;
    
    // Registrar transacción
    const { error: transaccionError } = await supabaseAdmin
      .from('transacciones')
      .insert({
        cuenta_destino_id: tipo === 'deposito' ? cuenta_id : null,
        cuenta_origen_id: tipo === 'retiro' ? cuenta_id : null,
        monto: monto,
        tipo: tipo,
        descripcion: `Operación de admin: ${tipo}`
      });
    if (transaccionError) throw transaccionError;

    return new Response(JSON.stringify({ message: "Operación exitosa", nuevoSaldo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

## File: `supabase\functions\iniciar-transferencia-cliente\index.ts`
```ts
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { numero_cuenta_destino, monto } = await req.json();

    // Obtener la cuenta de origen del usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado.");
    
    const { data: cuentaOrigen, error: cuentaError } = await supabase
      .from('cuentas')
      .select('id')
      .eq('usuario_id', user.id)
      .single();
    if (cuentaError || !cuentaOrigen) throw new Error("Cuenta de origen no encontrada.");

    // Llamar a la función RPC de la base de datos
    const { error: rpcError } = await supabase.rpc('realizar_transferencia', {
      cuenta_origen_id_param: cuentaOrigen.id,
      numero_cuenta_destino_param: numero_cuenta_destino,
      monto_param: monto,
    });
    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ message: 'Transferencia iniciada con éxito.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

## File: `tailwind.config.ts`
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
  // ChitiBank Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1e3a8a', // Main blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: '#1e3a8a',
          foreground: '#ffffff',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a', // Main green
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#14532d',
          950: '#052e16',
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          "1": 'hsl(var(--chart-1))',
          "2": 'hsl(var(--chart-2))',
          "3": 'hsl(var(--chart-3))',
          "4": 'hsl(var(--chart-4))',
          "5": 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

```
