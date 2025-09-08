# Project Structure

```
banco_ie/
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── export-codebase.py
├── full_codebase.md
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
│   │   ├── admin
│   │   │   ├── layout.tsx
│   │   │   ├── lista-alumnos
│   │   │   │   ├── page-new.tsx
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
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── table.tsx
│   ├── contexts
│   ├── lib
│   │   ├── supabase
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   └── utils.ts
│   └── middleware.ts
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
    "@supabase/auth-helpers-nextjs": "^0.10.0",
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
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
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

## File: `full_codebase.md`
```md
# Project Structure

```
banco_ie/
├── .gitignore
├── eslint.config.mjs
├── export-codebase.py
├── full_codebase.md
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
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── layout.tsx
│   │   │   ├── lista-alumnos
│   │   │   │   ├── page-new.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo-alumno
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── drive-scrape
│   │   │       └── route.ts
│   │   ├── auth
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
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── table.tsx
│   ├── contexts
│   │   └── banco-munay-context.tsx
│   └── lib
│       ├── csv-storage.ts
│       ├── local-storage.ts
│       └── utils.ts
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
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.4",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.468.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.4",
    "@eslint/eslintrc": "^3"
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
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

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

## File: `full_codebase.md`
```md
# Project Structure

```
banco_ie/
├── .gitignore
├── eslint.config.mjs
├── export-codebase.py
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── layout.tsx
│   │   │   ├── lista-alumnos
│   │   │   │   ├── page-new.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo-alumno
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── admin-guard.tsx
│   │   ├── admin-navigation.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── table.tsx
│   ├── contexts
│   │   └── banco-munay-context.tsx
│   └── lib
│       ├── csv-storage.ts
│       ├── local-storage.ts
│       └── utils.ts
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
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.4",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.468.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.4",
    "@eslint/eslintrc": "^3"
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
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

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

## File: `src\app\admin\layout.tsx`
```tsx
import AdminGuard from '@/components/admin-guard';
import AdminNavigation from '@/components/admin-navigation';

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

## File: `src\app\admin\lista-alumnos\page-new.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Pick<Student, 'id' | 'nombre' | 'saldo'>>({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\lista-alumnos\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\nuevo-alumno\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    montoInicial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addStudent } = useBancoMunay();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const monto = parseFloat(formData.montoInicial);
    if (!formData.montoInicial) {
      newErrors.montoInicial = 'El monto inicial es obligatorio';
    } else if (isNaN(monto)) {
      newErrors.montoInicial = 'Debe ser un número válido';
    } else if (monto < 0) {
      newErrors.montoInicial = 'El monto no puede ser negativo';
    } else if (monto > 100000) {
      newErrors.montoInicial = 'El monto no puede exceder S/ 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const monto = parseFloat(formData.montoInicial);
      addStudent(formData.nombre.trim(), monto);
      
      setShowSuccess(true);
      
      // Resetear form
      setFormData({
        nombre: '',
        montoInicial: '',
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/admin/lista-alumnos');
      }, 2000);

    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ general: 'Error al registrar el alumno. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      montoInicial: '',
    });
    setErrors({});
    setShowSuccess(false);
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
            <CardDescription className="text-green-700">
              El estudiante ha sido añadido exitosamente al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">
              Redirigiendo a la lista de alumnos...
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Registrar Otro
              </Button>
              <Button variant="munayGreen" asChild className="flex-1">
                <Link href="/admin/lista-alumnos">Ver Lista</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-munay-blue transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-munay-blue font-medium">Nuevo Alumno</span>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-munay-blue">Registrar Nuevo Alumno</CardTitle>
          <CardDescription>
            Completa la información para crear una nueva cuenta estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo del alumno</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María González Pérez"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Monto Inicial */}
            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (en soles peruanos)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                <Input
                  id="montoInicial"
                  name="montoInicial"
                  type="number"
                  placeholder="0.00"
                  value={formData.montoInicial}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.montoInicial ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.montoInicial && (
                <p className="text-sm text-red-600">{errors.montoInicial}</p>
              )}
              <p className="text-xs text-gray-600">
                Cantidad de dinero en soles con la que el alumno inicia su cuenta
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="munay"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar Alumno
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Asegúrate de escribir el nombre completo</li>
              <li>• El monto inicial puede ser cualquier cantidad</li>
              <li>• Los datos se guardan automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 text-center">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\page.tsx`
```tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  Download,
  Upload
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, exportToCSV, importFromCSV } = useBancoMunay();

  // Calcular estadísticas
  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;
  const recentStudents = students.slice(-3).reverse(); // Los 3 más recientes

  const handleImportCSV = async () => {
    try {
      await importFromCSV();
      // Mostrar mensaje de éxito si es necesario
    } catch (error) {
      console.error('Error importing CSV:', error);
      // Mostrar mensaje de error si es necesario
    }
  };

  const statsCards = [
    {
      title: 'Total de Alumnos',
      value: totalStudents.toString(),
      description: 'Estudiantes registrados',
      icon: Users,
      color: 'text-munay-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Total',
      value: formatSoles(totalBalance),
      description: 'Dinero total en el banco',
      icon: DollarSign,
      color: 'text-munay-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saldo Promedio',
      value: formatSoles(averageBalance),
      description: 'Por estudiante',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Control
        </h1>
        <p className="text-gray-600">
          Gestiona el banco escolar y supervisa las cuentas de los estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-munay-blue transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-blue">Registrar Nuevo Alumno</CardTitle>
                <CardDescription>
                  Añade un nuevo estudiante al sistema bancario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munay" asChild className="w-full">
              <Link href="/admin/nuevo-alumno">
                Nuevo Alumno
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-munay-green transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-green text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-green">Ver Lista de Alumnos</CardTitle>
                <CardDescription>
                  Consulta y gestiona las cuentas existentes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munayGreen" asChild className="w-full">
              <Link href="/admin/lista-alumnos">
                Ver Lista Completa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Gestión de Datos</span>
          </CardTitle>
          <CardDescription>
            Exporta e importa datos de estudiantes en formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={exportToCSV} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar a CSV
            </Button>
            <Button variant="outline" onClick={handleImportCSV} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Importar desde CSV
            </Button>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Información CSV:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El archivo CSV se guarda con formato: id,nombre,saldo,fechaCreacion</li>
              <li>• Puedes editar el archivo en Excel y volver a importarlo</li>
              <li>• Los datos se mantienen sincronizados automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Estudiantes Recientes</span>
          </CardTitle>
          <CardDescription>
            Los últimos alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-munay-blue text-white p-2 rounded-full">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Registrado: {new Date(student.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-munay-green">
                      {formatSoles(student.saldo)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo inicial</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/lista-alumnos">
                    Ver todos los alumnos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay estudiantes registrados aún</p>
              <Button variant="munay" asChild>
                <Link href="/admin/nuevo-alumno">
                  Registrar Primer Alumno
                  <UserPlus className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { Banknote, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useBancoMunay();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos login - en un proyecto real aquí iría validación
    login(true); // Por defecto todos son admin
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Banco Munay</h1>
              <p className="text-sm text-gray-600">Banco Escolar</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-munay-blue">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta administrativa de Banco Munay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bancomunay.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" variant="munay">
                Ingresar al Sistema
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">Acceso de Demostración:</p>
                <p className="text-xs text-blue-700">
                  Puedes usar cualquier email y contraseña para acceder al sistema. 
                  Esta es una demo educativa sin validaciones reales.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/auth/register" className="text-munay-blue hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { Banknote, Eye, EyeOff, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: true, // Por defecto será admin
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useBancoMunay();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos registro - en un proyecto real aquí iría validación y guardado
    login(formData.isAdmin);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Banco Munay</h1>
              <p className="text-sm text-gray-600">Banco Escolar</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-munay-blue">Crear Cuenta</CardTitle>
            <CardDescription>
              Regístrate para acceder al sistema de Banco Munay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Profesor Juan Pérez"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="profesor@escuela.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg border border-green-200">
                <input
                  id="isAdmin"
                  name="isAdmin"
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-munay-green"
                />
                <Label htmlFor="isAdmin" className="text-sm text-green-800 flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Registro como Administrador/Profesor</span>
                </Label>
              </div>

              <Button type="submit" className="w-full" variant="munay">
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">Modo Demostración:</p>
                <p className="text-xs text-blue-700">
                  Esta es una demo educativa. Puedes usar cualquier información para registrarte.
                  No se requieren datos reales ni validaciones.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-munay-blue hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
            ← Volver al inicio
          </Link>
        </div>
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

    /* Banco Munay Custom Variables */
    --munay-blue: 225 100% 20%; /* #1e3a8a */
    --munay-green: 142 76% 36%; /* #16a34a */
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

/* Banco Munay Custom Utility Classes */
.bg-munay-blue {
  background-color: #1e3a8a !important;
}

.text-munay-blue {
  color: #1e3a8a !important;
}

.bg-munay-green {
  background-color: #16a34a !important;
}

.text-munay-green {
  color: #16a34a !important;
}

.hover\:bg-munay-blue\/90:hover {
  background-color: rgba(30, 58, 138, 0.9) !important;
}

.hover\:bg-munay-green\/90:hover {
  background-color: rgba(22, 163, 74, 0.9) !important;
}

.hover\:text-munay-blue:hover {
  color: #1e3a8a !important;
}

.border-munay-blue {
  border-color: #1e3a8a !important;
}

.border-munay-green {
  border-color: #16a34a !important;
}

.hover\:border-munay-blue:hover {
  border-color: #1e3a8a !important;
}

.hover\:border-munay-green:hover {
  border-color: #16a34a !important;
}

```

## File: `src\app\layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BancoMunayProvider } from "@/contexts/banco-munay-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banco Munay - Banco Escolar",
  description: "Sistema educativo de gestión bancaria para estudiantes",
  keywords: "banco escolar, educación financiera, Banco Munay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BancoMunayProvider>
          {children}
        </BancoMunayProvider>
      </body>
    </html>
  );
}

```

## File: `src\app\page.tsx`
```tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBancoMunay } from "@/contexts/banco-munay-context";
import { Banknote, GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { auth } = useBancoMunay();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isLoggedIn && auth.isAdmin) {
      router.push('/admin');
    }
  }, [auth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <Banknote className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-munay-blue">Banco Munay</h1>
                <p className="text-xs text-gray-600">Banco Escolar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="munay" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-munay-green text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Educación Financiera</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenidos a{" "}
            <span className="text-munay-blue">Banco Munay</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El primer banco escolar que enseña a los estudiantes sobre educación financiera 
            de manera práctica y divertida. Aprende a ahorrar, gestionar dinero y 
            desarrollar hábitos financieros saludables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="munay" asChild>
              <Link href="/auth/register">Comenzar Ahora</Link>
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
              ¿Por qué elegir Banco Munay?
            </h2>
            <p className="text-xl text-gray-600">
              Una plataforma diseñada específicamente para la educación financiera estudiantil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Educación Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Aprende conceptos financieros a través de experiencias reales de ahorro y gestión de dinero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-green transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-green text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-green">Seguro y Confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Plataforma segura diseñada específicamente para el entorno educativo escolar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Gestión Sencilla</CardTitle>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-munay-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu educación financiera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de estudiantes que ya están aprendiendo sobre finanzas con Banco Munay
          </p>
          <Button size="lg" variant="munayGreen" asChild>
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <Banknote className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Banco Munay</h3>
                <p className="text-sm text-gray-400">Educación financiera escolar</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Banco Munay. Proyecto educativo sin fines comerciales.
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

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBancoMunay } from '@/contexts/banco-munay-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { auth, loading } = useBancoMunay();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!auth.isLoggedIn || !auth.isAdmin)) {
      router.push('/auth/login');
    }
  }, [auth, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-munay-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn || !auth.isAdmin) {
    return null;
  }

  return <>{children}</>;
}

```

## File: `src\components\admin-navigation.tsx`
```tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { 
  Banknote, 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useBancoMunay();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      href: '/admin/nuevo-alumno',
      label: 'Nuevo Alumno',
      icon: UserPlus,
      active: pathname === '/admin/nuevo-alumno'
    },
    {
      href: '/admin/lista-alumnos',
      label: 'Lista de Alumnos',
      icon: Users,
      active: pathname === '/admin/lista-alumnos'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-munay-blue">Banco Munay</h1>
              <p className="text-xs text-gray-600">Panel Administrativo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-munay-blue text-white'
                      : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-munay-blue text-white'
                        : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start mt-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

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
        munay: "bg-munay-blue text-white shadow hover:bg-munay-blue/90",
        munayGreen: "bg-munay-green text-white shadow hover:bg-munay-green/90",
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

## File: `src\contexts\banco-munay-context.tsx`
```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Student, 
  AuthData, 
  getStudents, 
  getAuthData, 
  saveAuthData, 
  addStudent as addStudentToStorage,
  updateStudent as updateStudentInStorage,
  deleteStudent as deleteStudentFromStorage,
  downloadStudentsCSV,
  uploadStudentsCSV,
  saveStudents
} from '@/lib/csv-storage';

interface BancoMunayContextType {
  // Students
  students: Student[];
  addStudent: (nombre: string, montoInicial: number) => void;
  updateStudent: (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => boolean;
  deleteStudent: (id: string) => boolean;
  refreshStudents: () => void;
  
  // CSV Operations
  exportToCSV: () => void;
  importFromCSV: () => Promise<void>;
  
  // Auth
  auth: AuthData;
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  
  // Loading
  loading: boolean;
}

const BancoMunayContext = createContext<BancoMunayContextType | undefined>(undefined);

export function BancoMunayProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [auth, setAuth] = useState<AuthData>({ isAdmin: false, isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      setStudents(getStudents());
      setAuth(getAuthData());
      setLoading(false);
    };

    initializeData();
  }, []);

  const refreshStudents = () => {
    setStudents(getStudents());
  };

  const addStudent = (nombre: string, montoInicial: number) => {
    const newStudent = addStudentToStorage(nombre, montoInicial);
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => {
    const updatedStudent = updateStudentInStorage(id, updates);
    if (updatedStudent) {
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return true;
    }
    return false;
  };

  const deleteStudent = (id: string) => {
    const success = deleteStudentFromStorage(id);
    if (success) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
    return success;
  };

  const exportToCSV = () => {
    downloadStudentsCSV(students);
  };

  const importFromCSV = async () => {
    try {
      const importedStudents = await uploadStudentsCSV();
      saveStudents(importedStudents);
      setStudents(importedStudents);
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  };

  const login = (isAdmin: boolean = true) => {
    const authData = { isAdmin, isLoggedIn: true };
    saveAuthData(authData);
    setAuth(authData);
  };

  const logout = () => {
    const authData = { isAdmin: false, isLoggedIn: false };
    saveAuthData(authData);
    setAuth(authData);
  };

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
    exportToCSV,
    importFromCSV,
    auth,
    login,
    logout,
    loading,
  };

  return (
    <BancoMunayContext.Provider value={value}>
      {children}
    </BancoMunayContext.Provider>
  );
}

export function useBancoMunay() {
  const context = useContext(BancoMunayContext);
  if (context === undefined) {
    throw new Error('useBancoMunay must be used within a BancoMunayProvider');
  }
  return context;
}

```

## File: `src\lib\csv-storage.ts`
```ts
// CSV file management for students data
export interface Student {
  id: string;
  nombre: string;
  saldo: number;
  fechaCreacion: string;
}

// Auth interface
export interface AuthData {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Local Storage Keys (mantenemos para auth)
export const STORAGE_KEYS = {
  AUTH: 'banco_munay_auth',
} as const;

// CSV Headers
const CSV_HEADERS = 'id,nombre,saldo,fechaCreacion';

/**
 * Convert students array to CSV format
 */
export function studentsToCSV(students: Student[]): string {
  const csvRows = [CSV_HEADERS];
  
  for (const student of students) {
    const row = [
      student.id,
      `"${student.nombre}"`, // Quoted to handle names with commas
      student.saldo.toString(),
      student.fechaCreacion
    ].join(',');
    csvRows.push(row);
  }
  
  return csvRows.join('\n');
}

/**
 * Parse CSV content to students array
 */
export function csvToStudents(csvContent: string): Student[] {
  const lines = csvContent.trim().split('\n');
  
  // Skip header row
  if (lines.length <= 1) return [];
  
  const students: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles quoted fields)
    const fields = parseCSVLine(line);
    
    if (fields.length >= 4) {
      students.push({
        id: fields[0],
        nombre: fields[1].replace(/^"|"$/g, ''), // Remove quotes
        saldo: parseFloat(fields[2]) || 0,
        fechaCreacion: fields[3]
      });
    }
  }
  
  return students;
}

/**
 * Simple CSV line parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current);
  return fields;
}

/**
 * Download CSV file with students data
 */
export function downloadStudentsCSV(students: Student[]): void {
  const csvContent = studentsToCSV(students);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `banco_munay_alumnos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload and parse CSV file
 */
export function uploadStudentsCSV(): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const students = csvToStudents(csvContent);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
}

/**
 * Get students from localStorage (fallback) or return empty array
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('banco_munay_students');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage (fallback)
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('banco_munay_students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
}

/**
 * Add a new student
 */
export function addStudent(nombre: string, montoInicial: number): Student {
  const newStudent: Student = {
    id: generateId(),
    nombre,
    saldo: montoInicial,
    fechaCreacion: new Date().toISOString(),
  };
  
  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  
  return newStudent;
}

/**
 * Update an existing student
 */
export function updateStudent(id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>): Student | null {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  students[index] = {
    ...students[index],
    ...updates
  };
  
  saveStudents(students);
  return students[index];
}

/**
 * Delete a student
 */
export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const initialLength = students.length;
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (filteredStudents.length === initialLength) {
    return false; // Student not found
  }
  
  saveStudents(filteredStudents);
  return true;
}

/**
 * Get auth data from localStorage
 */
export function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { isAdmin: false, isLoggedIn: false };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isAdmin: false, isLoggedIn: false };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { isAdmin: false, isLoggedIn: false };
  }
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
}

/**
 * Login user
 */
export function login(isAdmin: boolean = true): void {
  saveAuthData({ isAdmin, isLoggedIn: true });
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('banco_munay_students');
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format currency in Soles
 */
export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

```

## File: `src\lib\local-storage.ts`
```ts
// Student data interface
export interface Student {
  id: string;
  nombre: string;
  saldo: number;
  fechaCreacion: string;
}

// Auth interface
export interface AuthData {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  STUDENTS: 'banco_munay_students',
  AUTH: 'banco_munay_auth',
} as const;

/**
 * Get students from localStorage
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
}

/**
 * Add a new student
 */
export function addStudent(nombre: string, montoInicial: number): Student {
  const newStudent: Student = {
    id: generateId(),
    nombre,
    saldo: montoInicial,
    fechaCreacion: new Date().toISOString(),
  };
  
  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  
  return newStudent;
}

/**
 * Get auth data from localStorage
 */
export function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { isAdmin: false, isLoggedIn: false };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isAdmin: false, isLoggedIn: false };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { isAdmin: false, isLoggedIn: false };
  }
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
}

/**
 * Login user
 */
export function login(isAdmin: boolean = true): void {
  saveAuthData({ isAdmin, isLoggedIn: true });
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

```

## File: `src\lib\utils.ts`
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
        // Banco Munay Brand Colors
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

## File: `src\app\admin\layout.tsx`
```tsx
import AdminGuard from '@/components/admin-guard';
import AdminNavigation from '@/components/admin-navigation';

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

## File: `src\app\admin\lista-alumnos\page-new.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Pick<Student, 'id' | 'nombre' | 'saldo'>>({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\lista-alumnos\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\nuevo-alumno\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    montoInicial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addStudent } = useBancoMunay();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const monto = parseFloat(formData.montoInicial);
    if (!formData.montoInicial) {
      newErrors.montoInicial = 'El monto inicial es obligatorio';
    } else if (isNaN(monto)) {
      newErrors.montoInicial = 'Debe ser un número válido';
    } else if (monto < 0) {
      newErrors.montoInicial = 'El monto no puede ser negativo';
    } else if (monto > 100000) {
      newErrors.montoInicial = 'El monto no puede exceder S/ 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const monto = parseFloat(formData.montoInicial);
      addStudent(formData.nombre.trim(), monto);
      
      setShowSuccess(true);
      
      // Resetear form
      setFormData({
        nombre: '',
        montoInicial: '',
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/admin/lista-alumnos');
      }, 2000);

    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ general: 'Error al registrar el alumno. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      montoInicial: '',
    });
    setErrors({});
    setShowSuccess(false);
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
            <CardDescription className="text-green-700">
              El estudiante ha sido añadido exitosamente al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">
              Redirigiendo a la lista de alumnos...
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Registrar Otro
              </Button>
              <Button variant="munayGreen" asChild className="flex-1">
                <Link href="/admin/lista-alumnos">Ver Lista</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-munay-blue transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-munay-blue font-medium">Nuevo Alumno</span>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-munay-blue">Registrar Nuevo Alumno</CardTitle>
          <CardDescription>
            Completa la información para crear una nueva cuenta estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo del alumno</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María González Pérez"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Monto Inicial */}
            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (en soles peruanos)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                <Input
                  id="montoInicial"
                  name="montoInicial"
                  type="number"
                  placeholder="0.00"
                  value={formData.montoInicial}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.montoInicial ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.montoInicial && (
                <p className="text-sm text-red-600">{errors.montoInicial}</p>
              )}
              <p className="text-xs text-gray-600">
                Cantidad de dinero en soles con la que el alumno inicia su cuenta
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="munay"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar Alumno
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Asegúrate de escribir el nombre completo</li>
              <li>• El monto inicial puede ser cualquier cantidad</li>
              <li>• Los datos se guardan automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 text-center">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\page.tsx`
```tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  Download,
  Upload
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, exportToCSV, importFromCSV } = useBancoMunay();

  // Calcular estadísticas
  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;
  const recentStudents = students.slice(-3).reverse(); // Los 3 más recientes

  const handleImportCSV = async () => {
    try {
      await importFromCSV();
      // Mostrar mensaje de éxito si es necesario
    } catch (error) {
      console.error('Error importing CSV:', error);
      // Mostrar mensaje de error si es necesario
    }
  };

  const statsCards = [
    {
      title: 'Total de Alumnos',
      value: totalStudents.toString(),
      description: 'Estudiantes registrados',
      icon: Users,
      color: 'text-munay-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Total',
      value: formatSoles(totalBalance),
      description: 'Dinero total en el banco',
      icon: DollarSign,
      color: 'text-munay-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saldo Promedio',
      value: formatSoles(averageBalance),
      description: 'Por estudiante',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Control
        </h1>
        <p className="text-gray-600">
          Gestiona el banco escolar y supervisa las cuentas de los estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-munay-blue transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-blue">Registrar Nuevo Alumno</CardTitle>
                <CardDescription>
                  Añade un nuevo estudiante al sistema bancario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munay" asChild className="w-full">
              <Link href="/admin/nuevo-alumno">
                Nuevo Alumno
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-munay-green transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-green text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-green">Ver Lista de Alumnos</CardTitle>
                <CardDescription>
                  Consulta y gestiona las cuentas existentes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munayGreen" asChild className="w-full">
              <Link href="/admin/lista-alumnos">
                Ver Lista Completa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Gestión de Datos</span>
          </CardTitle>
          <CardDescription>
            Exporta e importa datos de estudiantes en formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={exportToCSV} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar a CSV
            </Button>
            <Button variant="outline" onClick={handleImportCSV} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Importar desde CSV
            </Button>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Información CSV:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El archivo CSV se guarda con formato: id,nombre,saldo,fechaCreacion</li>
              <li>• Puedes editar el archivo en Excel y volver a importarlo</li>
              <li>• Los datos se mantienen sincronizados automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Estudiantes Recientes</span>
          </CardTitle>
          <CardDescription>
            Los últimos alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-munay-blue text-white p-2 rounded-full">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Registrado: {new Date(student.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-munay-green">
                      {formatSoles(student.saldo)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo inicial</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/lista-alumnos">
                    Ver todos los alumnos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay estudiantes registrados aún</p>
              <Button variant="munay" asChild>
                <Link href="/admin/nuevo-alumno">
                  Registrar Primer Alumno
                  <UserPlus className="h-4 w-4 ml-2" />
                </Link>
              </Button>
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
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { Banknote, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useBancoMunay();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos login - en un proyecto real aquí iría validación
    login(true); // Por defecto todos son admin
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
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
            <CardTitle className="text-2xl text-munay-blue">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta administrativa de ChitiBank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@chitibank.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" variant="munay">
                Ingresar al Sistema
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">Acceso de Demostración:</p>
                <p className="text-xs text-blue-700">
                  Puedes usar cualquier email y contraseña para acceder al sistema. 
                  Esta es una demo educativa sin validaciones reales.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/auth/register" className="text-munay-blue hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { Banknote, Eye, EyeOff, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: true, // Por defecto será admin
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useBancoMunay();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos registro - en un proyecto real aquí iría validación y guardado
    login(formData.isAdmin);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
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
            <CardTitle className="text-2xl text-munay-blue">Crear Cuenta</CardTitle>
            <CardDescription>
              Regístrate para acceder al sistema de ChitiBank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Profesor Juan Pérez"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="profesor@escuela.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg border border-green-200">
                <input
                  id="isAdmin"
                  name="isAdmin"
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-munay-green"
                />
                <Label htmlFor="isAdmin" className="text-sm text-green-800 flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Registro como Administrador/Profesor</span>
                </Label>
              </div>

              <Button type="submit" className="w-full" variant="munay">
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">Modo Demostración:</p>
                <p className="text-xs text-blue-700">
                  Esta es una demo educativa. Puedes usar cualquier información para registrarte.
                  No se requieren datos reales ni validaciones.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-munay-blue hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
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
              <Button variant="munay">Abrir carpeta raíz en Drive</Button>
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
                  <CardTitle className="text-munay-blue">{f.name}</CardTitle>
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
                    <CardTitle className="text-munay-blue">{it.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Archivo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">ID: {it.id}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="munay" onClick={() => openPreview(it)}>Ver</Button>
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
                  <Button variant="munay">Abrir en Drive</Button>
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
    --munay-blue: 225 100% 20%; /* #1e3a8a */
    --munay-green: 142 76% 36%; /* #16a34a */
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
.bg-munay-blue {
  background-color: #1e3a8a !important;
}

.text-munay-blue {
  color: #1e3a8a !important;
}

.bg-munay-green {
  background-color: #16a34a !important;
}

.text-munay-green {
  color: #16a34a !important;
}

.hover\:bg-munay-blue\/90:hover {
  background-color: rgba(30, 58, 138, 0.9) !important;
}

.hover\:bg-munay-green\/90:hover {
  background-color: rgba(22, 163, 74, 0.9) !important;
}

.hover\:text-munay-blue:hover {
  color: #1e3a8a !important;
}

.border-munay-blue {
  border-color: #1e3a8a !important;
}

.border-munay-green {
  border-color: #16a34a !important;
}

.hover\:border-munay-blue:hover {
  border-color: #1e3a8a !important;
}

.hover\:border-munay-green:hover {
  border-color: #16a34a !important;
}

```

## File: `src\app\layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BancoMunayProvider as ChitiBankProvider } from "@/contexts/banco-munay-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChitiBank - Banco Escolar",
  description: "Sistema educativo de gestión bancaria para estudiantes",
  keywords: "banco escolar, educación financiera, ChitiBank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
  <ChitiBankProvider>
          {children}
  </ChitiBankProvider>
      </body>
    </html>
  );
}

```

## File: `src\app\page.tsx`
```tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBancoMunay } from "@/contexts/banco-munay-context";
import { GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { auth } = useBancoMunay();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isLoggedIn && auth.isAdmin) {
      router.push('/admin');
    }
  }, [auth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-munay-blue">ChitiBank</h1>
                <p className="text-xs text-gray-600">Banco Escolar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="munay" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-munay-green text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Educación Financiera</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenidos a{" "}
            <span className="text-munay-blue">ChitiBank</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El primer banco escolar que enseña a los estudiantes sobre educación financiera 
            de manera práctica y divertida. Aprende a ahorrar, gestionar dinero y 
            desarrollar hábitos financieros saludables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="munay" asChild>
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
            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Educación Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Aprende conceptos financieros a través de experiencias reales de ahorro y gestión de dinero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-green transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-green text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-green">Seguro y Confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Plataforma segura diseñada específicamente para el entorno educativo escolar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Gestión Sencilla</CardTitle>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-munay-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu educación financiera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de estudiantes que ya están aprendiendo sobre finanzas con ChitiBank
          </p>
          <Button size="lg" variant="munayGreen" asChild>
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-8 w-auto" />
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

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBancoMunay } from '@/contexts/banco-munay-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { auth, loading } = useBancoMunay();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!auth.isLoggedIn || !auth.isAdmin)) {
      router.push('/auth/login');
    }
  }, [auth, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-munay-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn || !auth.isAdmin) {
    return null;
  }

  return <>{children}</>;
}

```

## File: `src\components\admin-navigation.tsx`
```tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useBancoMunay();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      href: '/admin/nuevo-alumno',
      label: 'Nuevo Alumno',
      icon: UserPlus,
      active: pathname === '/admin/nuevo-alumno'
    },
    {
      href: '/admin/lista-alumnos',
      label: 'Lista de Alumnos',
      icon: Users,
      active: pathname === '/admin/lista-alumnos'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-munay-blue">ChitiBank</h1>
              <p className="text-xs text-gray-600">Panel Administrativo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-munay-blue text-white'
                      : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-munay-blue text-white'
                        : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start mt-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

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
        munay: "bg-munay-blue text-white shadow hover:bg-munay-blue/90",
        munayGreen: "bg-munay-green text-white shadow hover:bg-munay-green/90",
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

## File: `src\contexts\banco-munay-context.tsx`
```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Student, 
  AuthData, 
  getStudents, 
  getAuthData, 
  saveAuthData, 
  addStudent as addStudentToStorage,
  updateStudent as updateStudentInStorage,
  deleteStudent as deleteStudentFromStorage,
  downloadStudentsCSV,
  uploadStudentsCSV,
  saveStudents
} from '@/lib/csv-storage';

interface ChitiBankContextType {
  // Students
  students: Student[];
  addStudent: (nombre: string, montoInicial: number) => void;
  updateStudent: (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => boolean;
  deleteStudent: (id: string) => boolean;
  refreshStudents: () => void;
  
  // CSV Operations
  exportToCSV: () => void;
  importFromCSV: () => Promise<void>;
  
  // Auth
  auth: AuthData;
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  
  // Loading
  loading: boolean;
}

const ChitiBankContext = createContext<ChitiBankContextType | undefined>(undefined);

export function BancoMunayProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [auth, setAuth] = useState<AuthData>({ isAdmin: false, isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      setStudents(getStudents());
      setAuth(getAuthData());
      setLoading(false);
    };

    initializeData();
  }, []);

  const refreshStudents = () => {
    setStudents(getStudents());
  };

  const addStudent = (nombre: string, montoInicial: number) => {
    const newStudent = addStudentToStorage(nombre, montoInicial);
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>) => {
    const updatedStudent = updateStudentInStorage(id, updates);
    if (updatedStudent) {
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return true;
    }
    return false;
  };

  const deleteStudent = (id: string) => {
    const success = deleteStudentFromStorage(id);
    if (success) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
    return success;
  };

  const exportToCSV = () => {
    downloadStudentsCSV(students);
  };

  const importFromCSV = async () => {
    try {
      const importedStudents = await uploadStudentsCSV();
      saveStudents(importedStudents);
      setStudents(importedStudents);
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  };

  const login = (isAdmin: boolean = true) => {
    const authData = { isAdmin, isLoggedIn: true };
    saveAuthData(authData);
    setAuth(authData);
  };

  const logout = () => {
    const authData = { isAdmin: false, isLoggedIn: false };
    saveAuthData(authData);
    setAuth(authData);
  };

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
    exportToCSV,
    importFromCSV,
    auth,
    login,
    logout,
    loading,
  };

  return (
  <ChitiBankContext.Provider value={value}>
      {children}
  </ChitiBankContext.Provider>
  );
}

export function useBancoMunay() {
  const context = useContext(ChitiBankContext);
  if (context === undefined) {
    throw new Error('useBancoMunay must be used within a BancoMunayProvider');
  }
  return context;
}

```

## File: `src\lib\csv-storage.ts`
```ts
// CSV file management for students data
export interface Student {
  id: string;
  nombre: string;
  saldo: number;
  fechaCreacion: string;
}

// Auth interface
export interface AuthData {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Local Storage Keys (mantenemos para auth)
export const STORAGE_KEYS = {
  AUTH: 'chitiBank_auth'
};

// CSV Headers
const CSV_HEADERS = 'id,nombre,saldo,fechaCreacion';

/**
 * Convert students array to CSV format
 */
export function studentsToCSV(students: Student[]): string {
  const csvRows = [CSV_HEADERS];
  
  for (const student of students) {
    const row = [
      student.id,
      `"${student.nombre}"`, // Quoted to handle names with commas
      student.saldo.toString(),
      student.fechaCreacion
    ].join(',');
    csvRows.push(row);
  }
  
  return csvRows.join('\n');
}

/**
 * Parse CSV content to students array
 */
export function csvToStudents(csvContent: string): Student[] {
  const lines = csvContent.trim().split('\n');
  
  // Skip header row
  if (lines.length <= 1) return [];
  
  const students: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles quoted fields)
    const fields = parseCSVLine(line);
    
    if (fields.length >= 4) {
      students.push({
        id: fields[0],
        nombre: fields[1].replace(/^"|"$/g, ''), // Remove quotes
        saldo: parseFloat(fields[2]) || 0,
        fechaCreacion: fields[3]
      });
    }
  }
  
  return students;
}

/**
 * Simple CSV line parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current);
  return fields;
}

/**
 * Download CSV file with students data
 */
export function downloadStudentsCSV(students: Student[]): void {
  const csvContent = studentsToCSV(students);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `chitiBank_alumnos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload and parse CSV file
 */
export function uploadStudentsCSV(): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const students = csvToStudents(csvContent);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
}

/**
 * Get students from localStorage (fallback) or return empty array
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
  const data = localStorage.getItem('chitiBank_students');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage (fallback)
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
  localStorage.setItem('chitiBank_students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
}

/**
 * Add a new student
 */
export function addStudent(nombre: string, montoInicial: number): Student {
  const newStudent: Student = {
    id: generateId(),
    nombre,
    saldo: montoInicial,
    fechaCreacion: new Date().toISOString(),
  };
  
  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  
  return newStudent;
}

/**
 * Update an existing student
 */
export function updateStudent(id: string, updates: Partial<Pick<Student, 'nombre' | 'saldo'>>): Student | null {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  students[index] = {
    ...students[index],
    ...updates
  };
  
  saveStudents(students);
  return students[index];
}

/**
 * Delete a student
 */
export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const initialLength = students.length;
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (filteredStudents.length === initialLength) {
    return false; // Student not found
  }
  
  saveStudents(filteredStudents);
  return true;
}

/**
 * Get auth data from localStorage
 */
export function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { isAdmin: false, isLoggedIn: false };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isAdmin: false, isLoggedIn: false };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { isAdmin: false, isLoggedIn: false };
  }
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
}

/**
 * Login user
 */
export function login(isAdmin: boolean = true): void {
  saveAuthData({ isAdmin, isLoggedIn: true });
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('chitiBank_students');
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format currency in Soles
 */
export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

```

## File: `src\lib\local-storage.ts`
```ts
// Student data interface
export interface Student {
  id: string;
  nombre: string;
  saldo: number;
  fechaCreacion: string;
}

// Auth interface
export interface AuthData {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  STUDENTS: 'chitiBank_students',
  AUTH: 'chitiBank_auth'
};

/**
 * Get students from localStorage
 */
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return [];
  }
}

/**
 * Save students to localStorage
 */
export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
}

/**
 * Add a new student
 */
export function addStudent(nombre: string, montoInicial: number): Student {
  const newStudent: Student = {
    id: generateId(),
    nombre,
    saldo: montoInicial,
    fechaCreacion: new Date().toISOString(),
  };
  
  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  
  return newStudent;
}

/**
 * Get auth data from localStorage
 */
export function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { isAdmin: false, isLoggedIn: false };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { isAdmin: false, isLoggedIn: false };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { isAdmin: false, isLoggedIn: false };
  }
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
}

/**
 * Login user
 */
export function login(isAdmin: boolean = true): void {
  saveAuthData({ isAdmin, isLoggedIn: true });
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

/**
 * Generate a simple ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

```

## File: `src\lib\utils.ts`
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
    *   [ ] Configurar el proyecto en Supabase.
    *   [ ] Ejecutar los scripts SQL para crear las tablas.
    *   [ ] Configurar el cliente de Supabase en el proyecto Next.js y las variables de entorno.

2.  **Fase 2: Autenticación (2-3 días)**
    *   [ ] Refactorizar las páginas de Login y Registro para usar Supabase Auth.
    *   [ ] Implementar el logout.
    *   [ ] Actualizar los guardianes de rutas (`AdminGuard` y `ClientGuard`).

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

## File: `src\app\admin\layout.tsx`
```tsx
import AdminGuard from '@/components/admin-guard';
import AdminNavigation from '@/components/admin-navigation';

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

## File: `src\app\admin\lista-alumnos\page-new.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Pick<Student, 'id' | 'nombre' | 'saldo'>>({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\lista-alumnos\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancoMunay();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
              <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\nuevo-alumno\page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    montoInicial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addStudent } = useBancoMunay();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const monto = parseFloat(formData.montoInicial);
    if (!formData.montoInicial) {
      newErrors.montoInicial = 'El monto inicial es obligatorio';
    } else if (isNaN(monto)) {
      newErrors.montoInicial = 'Debe ser un número válido';
    } else if (monto < 0) {
      newErrors.montoInicial = 'El monto no puede ser negativo';
    } else if (monto > 100000) {
      newErrors.montoInicial = 'El monto no puede exceder S/ 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const monto = parseFloat(formData.montoInicial);
      addStudent(formData.nombre.trim(), monto);
      
      setShowSuccess(true);
      
      // Resetear form
      setFormData({
        nombre: '',
        montoInicial: '',
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/admin/lista-alumnos');
      }, 2000);

    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ general: 'Error al registrar el alumno. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      montoInicial: '',
    });
    setErrors({});
    setShowSuccess(false);
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
            <CardDescription className="text-green-700">
              El estudiante ha sido añadido exitosamente al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">
              Redirigiendo a la lista de alumnos...
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Registrar Otro
              </Button>
              <Button variant="munayGreen" asChild className="flex-1">
                <Link href="/admin/lista-alumnos">Ver Lista</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-munay-blue transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-munay-blue font-medium">Nuevo Alumno</span>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-munay-blue">Registrar Nuevo Alumno</CardTitle>
          <CardDescription>
            Completa la información para crear una nueva cuenta estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo del alumno</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María González Pérez"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Monto Inicial */}
            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (en soles peruanos)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                <Input
                  id="montoInicial"
                  name="montoInicial"
                  type="number"
                  placeholder="0.00"
                  value={formData.montoInicial}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.montoInicial ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.montoInicial && (
                <p className="text-sm text-red-600">{errors.montoInicial}</p>
              )}
              <p className="text-xs text-gray-600">
                Cantidad de dinero en soles con la que el alumno inicia su cuenta
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="munay"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar Alumno
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Asegúrate de escribir el nombre completo</li>
              <li>• El monto inicial puede ser cualquier cantidad</li>
              <li>• Los datos se guardan automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 text-center">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

```

## File: `src\app\admin\page.tsx`
```tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { formatSoles } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  Download,
  Upload
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, exportToCSV, importFromCSV } = useBancoMunay();

  // Calcular estadísticas
  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;
  const recentStudents = students.slice(-3).reverse(); // Los 3 más recientes

  const handleImportCSV = async () => {
    try {
      await importFromCSV();
      // Mostrar mensaje de éxito si es necesario
    } catch (error) {
      console.error('Error importing CSV:', error);
      // Mostrar mensaje de error si es necesario
    }
  };

  const statsCards = [
    {
      title: 'Total de Alumnos',
      value: totalStudents.toString(),
      description: 'Estudiantes registrados',
      icon: Users,
      color: 'text-munay-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Total',
      value: formatSoles(totalBalance),
      description: 'Dinero total en el banco',
      icon: DollarSign,
      color: 'text-munay-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saldo Promedio',
      value: formatSoles(averageBalance),
      description: 'Por estudiante',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Control
        </h1>
        <p className="text-gray-600">
          Gestiona el banco escolar y supervisa las cuentas de los estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-munay-blue transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-blue">Registrar Nuevo Alumno</CardTitle>
                <CardDescription>
                  Añade un nuevo estudiante al sistema bancario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munay" asChild className="w-full">
              <Link href="/admin/nuevo-alumno">
                Nuevo Alumno
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-munay-green transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-green text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-green">Ver Lista de Alumnos</CardTitle>
                <CardDescription>
                  Consulta y gestiona las cuentas existentes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="munayGreen" asChild className="w-full">
              <Link href="/admin/lista-alumnos">
                Ver Lista Completa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Gestión de Datos</span>
          </CardTitle>
          <CardDescription>
            Exporta e importa datos de estudiantes en formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={exportToCSV} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar a CSV
            </Button>
            <Button variant="outline" onClick={handleImportCSV} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Importar desde CSV
            </Button>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Información CSV:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El archivo CSV se guarda con formato: id,nombre,saldo,fechaCreacion</li>
              <li>• Puedes editar el archivo en Excel y volver a importarlo</li>
              <li>• Los datos se mantienen sincronizados automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Estudiantes Recientes</span>
          </CardTitle>
          <CardDescription>
            Los últimos alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-munay-blue text-white p-2 rounded-full">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Registrado: {new Date(student.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-munay-green">
                      {formatSoles(student.saldo)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo inicial</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/lista-alumnos">
                    Ver todos los alumnos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay estudiantes registrados aún</p>
              <Button variant="munay" asChild>
                <Link href="/admin/nuevo-alumno">
                  Registrar Primer Alumno
                  <UserPlus className="h-4 w-4 ml-2" />
                </Link>
              </Button>
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
            className="mt-6 inline-block rounded-md bg-munay-blue px-4 py-2 text-sm font-medium text-white hover:bg-munay-blue/90"
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
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = createClient()

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
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
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
            <CardTitle className="text-2xl text-munay-blue">Iniciar Sesión</CardTitle>
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

              <Button type="submit" className="w-full" variant="munay" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/auth/register" className="text-munay-blue hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Eye, EyeOff, UserCheck } from 'lucide-react';
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
  const router = useRouter();
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
          <Link href="/" className="inline-flex items-center space-x-3 text-munay-blue hover:text-munay-blue/80 transition-colors">
            <div className="bg-munay-blue text-white p-2 rounded-lg">
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
            <CardTitle className="text-2xl text-munay-blue">Crear Cuenta de Estudiante</CardTitle>
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

              <Button type="submit" className="w-full" variant="munay" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-munay-blue hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-munay-blue transition-colors">
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
              <Button variant="munay">Abrir carpeta raíz en Drive</Button>
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
                  <CardTitle className="text-munay-blue">{f.name}</CardTitle>
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
                    <CardTitle className="text-munay-blue">{it.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Archivo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">ID: {it.id}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="munay" onClick={() => openPreview(it)}>Ver</Button>
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
                  <Button variant="munay">Abrir en Drive</Button>
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
    --munay-blue: 225 100% 20%; /* #1e3a8a */
    --munay-green: 142 76% 36%; /* #16a34a */
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
.bg-munay-blue {
  background-color: #1e3a8a !important;
}

.text-munay-blue {
  color: #1e3a8a !important;
}

.bg-munay-green {
  background-color: #16a34a !important;
}

.text-munay-green {
  color: #16a34a !important;
}

.hover\:bg-munay-blue\/90:hover {
  background-color: rgba(30, 58, 138, 0.9) !important;
}

.hover\:bg-munay-green\/90:hover {
  background-color: rgba(22, 163, 74, 0.9) !important;
}

.hover\:text-munay-blue:hover {
  color: #1e3a8a !important;
}

.border-munay-blue {
  border-color: #1e3a8a !important;
}

.border-munay-green {
  border-color: #16a34a !important;
}

.hover\:border-munay-blue:hover {
  border-color: #1e3a8a !important;
}

.hover\:border-munay-green:hover {
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
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBancoMunay } from "@/contexts/banco-munay-context";
import { GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { auth } = useBancoMunay();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isLoggedIn && auth.isAdmin) {
      router.push('/admin');
    }
  }, [auth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-munay-blue">ChitiBank</h1>
                <p className="text-xs text-gray-600">Banco Escolar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="munay" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-munay-green text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Educación Financiera</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenidos a{" "}
            <span className="text-munay-blue">ChitiBank</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El primer banco escolar que enseña a los estudiantes sobre educación financiera 
            de manera práctica y divertida. Aprende a ahorrar, gestionar dinero y 
            desarrollar hábitos financieros saludables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="munay" asChild>
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
            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Educación Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Aprende conceptos financieros a través de experiencias reales de ahorro y gestión de dinero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-green transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-green text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-green">Seguro y Confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Plataforma segura diseñada específicamente para el entorno educativo escolar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-munay-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-munay-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-munay-blue">Gestión Sencilla</CardTitle>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-munay-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu educación financiera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de estudiantes que ya están aprendiendo sobre finanzas con ChitiBank
          </p>
          <Button size="lg" variant="munayGreen" asChild>
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-8 w-auto" />
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
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBancoMunay } from '@/contexts/banco-munay-context';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useBancoMunay();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      href: '/admin/nuevo-alumno',
      label: 'Nuevo Alumno',
      icon: UserPlus,
      active: pathname === '/admin/nuevo-alumno'
    },
    {
      href: '/admin/lista-alumnos',
      label: 'Lista de Alumnos',
      icon: Users,
      active: pathname === '/admin/lista-alumnos'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-munay-blue">ChitiBank</h1>
              <p className="text-xs text-gray-600">Panel Administrativo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-munay-blue text-white'
                      : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-munay-blue text-white'
                        : 'text-gray-600 hover:text-munay-blue hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start mt-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
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
        munay: "bg-munay-blue text-white shadow hover:bg-munay-blue/90",
        munayGreen: "bg-munay-green text-white shadow hover:bg-munay-green/90",
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

## File: `src\lib\supabase\server.ts`
```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

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
            } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
            }
        },
        remove(name: string, options: CookieOptions) {
            try {
                cookieStore.remove({ name, ...options })
            } catch (error) {
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
