# QSL Creator por LU9WT

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-2C2E3B?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://es.reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## Tabla de Contenidos

- [Visión General del Proyecto](#visión-general-del-proyecto)
- [Características Principales](#características-principales)
- [Estructura de la Aplicación](#estructura-de-la-aplicación)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Guía de Instalación](#guía-de-instalación)
- [Configuración](#configuración)
- [Flujo de Desarrollo](#flujo-de-desarrollo)
- [Instrucciones de Compilación](#instrucciones-de-compilación)
- [Pruebas](#pruebas)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Reconocimientos](#reconocimientos)

## Visión General del Proyecto

QSL Creator es una aplicación de escritorio profesional diseñada para radioaficionados que permite crear, gestionar y compartir tarjetas QSL digitales. La aplicación simplifica el proceso de registro de contactos de radio y generación de tarjetas QSL personalizadas con una interfaz intuitiva y funciones avanzadas.

## Características Principales

### Funcionalidades Principales
- 🖼️ Generación de tarjetas QSL personalizables
- 📊 Sistema de gestión de contactos
- 🎨 Múltiples diseños de plantillas
- 💾 Almacenamiento automático de datos
- 📤 Exportación en múltiples formatos (JPG, PNG, PDF)

### Aspectos Técnicos Destacados
- ⚡ Compatibilidad multiplataforma (Windows, macOS, Linux)
- 🔄 Vista previa en tiempo real
- 🛠️ Arquitectura de plugins para plantillas
- 🔒 Almacenamiento seguro de datos
- 📱 Diseño responsivo

## Estructura de la Aplicación

```
lu9wt-qsl-creator/
├── .github/               # Flujos de trabajo y plantillas de GitHub
├── build/                 # Configuraciones de compilación
├── dist/                  # Versiones compiladas para producción
├── node_modules/          # Dependencias
├── public/                # Archivos estáticos
y src/
    ├── main/              # Proceso principal
    │   ├── ipc/           # Manejadores IPC
    │   ├── menu/          # Menú de la aplicación
    │   └── updater/       # Lógica de actualización automática
    │
    ├── preload/          # Scripts de precarga
    │   └── index.js       # APIs expuestas
    │
    └── renderer/         # Aplicación React
        ├── assets/         # Recursos estáticos
        ├── components/     # Componentes reutilizables
        │   ├── common/     # Componentes compartidos
        │   ├── dialogs/    # Componentes de diálogo
        │   └── qsl/        # Componentes específicos de QSL
        │
        ├── hooks/         # Hooks personalizados de React
        │   ├── useAppInitialization.js
        │   ├── useKeyboardShortcuts.js
        │   ├── useMenuHandlers.js
        │   └── useQSLDownload.js
        │
        ├── stores/        # Gestión del estado
        ├── styles/         # Estilos globales
        ├── utils/          # Funciones de utilidad
        │   └── generateQSL.js
        │
        ├── App.jsx         # Componente raíz
        └── main.jsx        # Punto de entrada del renderizado
```

## Tecnologías Utilizadas

### Tecnologías Principales
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Electron, Node.js
- **Gestión de Estado**: React Hooks
- **Herramienta de Construcción**: Vite
- **Pruebas**: Jest, React Testing Library

### Herramientas de Desarrollo
- **Linting**: ESLint
- **Formato**: Prettier
- **Control de Versiones**: Git
- **CI/CD**: GitHub Actions

## Requisitos del Sistema

- **Sistema Operativo**: Windows 10/11, macOS 10.14+, o Linux
- **Node.js**: 18.0.0 o superior
- **npm**: 9.0.0 o superior
- **Espacio en Disco**: 500MB mínimo
- **RAM**: 2GB mínimo (4GB recomendado)

## Guía de Instalación

### Requisitos Previos

1. Instalar [Node.js](https://nodejs.org/) (versión LTS recomendada)
2. Instalar [Git](https://git-scm.com/)
3. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/lu9wt-qsl-creator.git
   cd lu9wt-qsl-creator
   ```

### Pasos de Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Aplicación
VITE_APP_NAME=QSL-Creator
VITE_APP_VERSION=1.0.0

# API (si aplica)
VITE_API_BASE_URL=http://localhost:3000/api

# Depuración
VITE_DEBUG_MODE=true
```

### Datos de Usuario

Los datos de la aplicación se almacenan en las siguientes ubicaciones:

- **Windows**: `%APPDATA%\lu9wt-qsl-creator`
- **macOS**: `~/Library/Application Support/lu9wt-qsl-creator`
- **Linux**: `~/.config/lu9wt-qsl-creator`

## Flujo de Desarrollo

### Comandos Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Crear versión de producción
- `npm test` - Ejecutar pruebas
- `npm run lint` - Verificar estilo de código
- `npm run format` - Formatear código
- `npm run electron:dev` - Iniciar Electron en desarrollo
- `npm run electron:build` - Compilar aplicación Electron

### Estilo de Código

- Seguir la [Guía de Estilo de JavaScript de Airbnb](https://github.com/airbnb/javascript)
- Usar mensajes de commit significativos siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/)
- Mantener componentes pequeños y enfocados
- Escribir pruebas para nuevas funcionalidades

## Instrucciones de Compilación

### Versión de Desarrollo

```bash
npm run build:dev
```

### Versiones de Producción

- **Windows**:
  ```bash
  npm run build:win
  ```

- **macOS**:
  ```bash
  npm run build:mac
  ```

- **Linux**:
  ```bash
  npm run build:linux
  ```

Las versiones compiladas estarán disponibles en el directorio `dist`.

## Pruebas

### Pruebas Unitarias

```bash
npm test
```

### Pruebas E2E

```bash
npm run test:e2e
```

### Cobertura de Pruebas

```bash
npm run test:coverage
```

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/MiNuevaFuncion`)
3. Haz commit de tus cambios (`git commit -m 'Añadir MiNuevaFuncion'`)
4. Sube los cambios a tu rama (`git push origin feature/MiNuevaFuncion`)
5. Abre un Pull Request

Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer nuestro código de conducta y el proceso para enviar pull requests.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Reconocimientos

- [Electron](https://www.electronjs.org/)
- [React](https://es.reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- A todos los colaboradores que han ayudado a dar forma a este proyecto

---

Desarrollado con ❤️ por LU9WT
