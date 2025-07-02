# 🏦 Banco Munay - Sistema Bancario Educativo

Una aplicación web educativa que simula un banco escolar, permitiendo a profesores gestionar cuentas de estudiantes y enseñar conceptos básicos de educación financiera.

## 🎯 Características

### ✨ Funcionalidades Principales
- **Landing Page** con branding del Banco Munay
- **Sistema de Autenticación** simple (sin validaciones reales)
- **Panel Administrativo** completo con:
  - Dashboard con estadísticas
  - Formulario para registrar nuevos alumnos
  - Lista completa de estudiantes con búsqueda y filtros
- **Persistencia de Datos** en localStorage
- **Diseño Responsive** móvil-first
- **Interfaz Intuitiva** con shadcn/ui

### 🎨 Diseño
- **Paleta de colores**: Azul #1e3a8a (principal) y Verde #16a34a (acento)
- **Tipografía**: Geist Sans optimizada
- **Componentes**: shadcn/ui para consistencia
- **Responsive**: Diseño móvil-first

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/banco_ie.git
   cd banco_ie
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o si usas pnpm
   pnpm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o si usas pnpm
   pnpm dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

## 🏗️ Estructura del Proyecto

```
banco_ie/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── auth/              # Páginas de autenticación
│   │   │   ├── login/         # Página de login
│   │   │   └── register/      # Página de registro
│   │   ├── admin/             # Área administrativa
│   │   │   ├── nuevo-alumno/  # Formulario nuevo alumno
│   │   │   ├── lista-alumnos/ # Lista de estudiantes
│   │   │   ├── layout.tsx     # Layout del admin
│   │   │   └── page.tsx       # Dashboard
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Landing page
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # Componentes de shadcn/ui
│   │   ├── admin-guard.tsx    # Protección de rutas
│   │   └── admin-navigation.tsx # Navegación admin
│   ├── contexts/              # Contextos de React
│   │   └── banco-munay-context.tsx # Estado global
│   └── lib/                   # Utilidades
│       ├── local-storage.ts   # Helpers de localStorage
│       └── utils.ts           # Utilidades generales
├── public/                    # Archivos estáticos
├── package.json              # Dependencias
├── tailwind.config.ts        # Configuración Tailwind
├── tsconfig.json            # Configuración TypeScript
└── README.md                # Este archivo
```

## 🎮 Uso del Sistema

### 1. Acceso Inicial
- Visita la página principal en `http://localhost:3000`
- Puedes navegar libremente por la landing page
- Usa los botones de "Iniciar Sesión" o "Registrarse"

### 2. Autenticación (Demo)
- **Login/Registro**: Acepta cualquier email/contraseña
- **No hay validaciones**: Es solo para demostración
- Automáticamente otorga permisos de administrador

### 3. Panel Administrativo
Una vez autenticado, accederás al dashboard con:

#### Dashboard Principal (`/admin`)
- Estadísticas generales (total alumnos, saldos, promedios)
- Accesos rápidos a funciones principales
- Lista de estudiantes recientes

#### Nuevo Alumno (`/admin/nuevo-alumno`)
- Formulario para registrar estudiantes
- Campos: Nombre y Monto Inicial
- Validaciones básicas
- Confirmación de registro exitoso

#### Lista de Alumnos (`/admin/lista-alumnos`)
- Tabla responsive con todos los estudiantes
- Búsqueda en tiempo real por nombre
- Filtros de ordenamiento (nombre, saldo, fecha)
- Estadísticas consolidadas
- Botón de actualización manual

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático
1. Conecta tu repositorio con Vercel
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente Next.js
4. ¡Deploy automático!

### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de Entorno
No se requieren variables de entorno para este proyecto demo.

## 🛠️ Tecnologías Utilizadas

### Core
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático

### UI/Estilos
- **Tailwind CSS v4** - Framework de CSS utility-first
- **shadcn/ui** - Componentes de interfaz de usuario
- **Lucide React** - Iconos modernos
- **Geist Font** - Tipografía optimizada

### Estado y Datos
- **React Context** - Gestión de estado global
- **localStorage** - Persistencia de datos local

### Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesador de CSS

## 🎓 Propósito Educativo

Este proyecto está diseñado específicamente para:

### Para Estudiantes
- Aprender conceptos básicos de ahorro y gestión de dinero
- Familiarizarse con interfaces bancarias de forma segura
- Desarrollar hábitos financieros saludables

### Para Profesores
- Herramienta práctica para enseñar educación financiera
- Interface sencilla para gestionar cuentas estudiantiles
- Sistema sin complejidades técnicas

### Para Desarrolladores
- Ejemplo de aplicación Next.js con App Router
- Implementación de shadcn/ui components
- Patrón de estado global con React Context
- Diseño responsive y accesible

## 🔧 Personalización

### Cambiar Colores del Branding
Edita `src/app/globals.css` y `tailwind.config.ts`:

```css
/* globals.css */
--munay-blue: 225 100% 20%; /* Tu color azul */
--munay-green: 142 76% 36%; /* Tu color verde */
```

### Modificar Datos Persistentes
Los helpers están en `src/lib/local-storage.ts` para personalizar el almacenamiento.

### Agregar Nuevas Funcionalidades
La arquitectura modular permite agregar fácilmente:
- Transacciones entre cuentas
- Históricos de movimientos
- Reportes y gráficas
- Autenticación real

## 🤝 Contribuciones

Este es un proyecto educativo abierto a contribuciones:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto con fines educativos. Siéntete libre de usarlo, modificarlo y compartirlo para propósitos educativos.

## ⚠️ Disclaimer

**Importante**: Este es un proyecto demo con propósitos educativos únicamente. No incluye:
- Autenticación real
- Validaciones de seguridad
- Conexión a bases de datos reales
- Manejo de dinero real

Para uso en producción, implementa autenticación segura y validaciones apropiadas.

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
- Abre un [Issue](https://github.com/tu-usuario/banco_ie/issues)
- Consulta la [documentación de Next.js](https://nextjs.org/docs)
- Revisa la [documentación de shadcn/ui](https://ui.shadcn.com)

---

**¡Que disfrutes explorando el mundo de la educación financiera con Banco Munay! 🏦✨**
