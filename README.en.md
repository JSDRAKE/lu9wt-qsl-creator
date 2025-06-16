# QSL Creator by LU9WT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-2C2E3B?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Application Structure](#application-structure)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Build Instructions](#build-instructions)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Overview

QSL Creator is a professional desktop application designed for amateur radio operators to create, manage, and share digital QSL cards. The application streamlines the process of logging radio contacts and generating custom QSL cards with an intuitive interface and powerful features.

## Key Features

### Core Functionality
- 🖼️ Customizable QSL card generation
- 📊 Contact management system
- 🎨 Multiple template designs
- 💾 Automatic data persistence
- 📤 Export in multiple formats (JPG, PNG, PDF)

### Technical Highlights
- ⚡ Cross-platform compatibility (Windows, macOS, Linux)
- 🔄 Real-time preview
- 🛠️ Plugin architecture for templates
- 🔒 Secure data storage
- 📱 Responsive design

## Application Structure

```
lu9wt-qsl-creator/
├── .github/               # GitHub workflows and templates
├── build/                 # Build configurations
├── dist/                  # Production builds
├── node_modules/          # Dependencies
├── public/                # Static assets
└── src/
    ├── main/              # Main process
    │   ├── ipc/           # IPC handlers
    │   ├── menu/          # Application menu
    │   └── updater/       # Auto-update logic
    │
    ├── preload/          # Preload scripts
    │   └── index.js       # Exposed APIs
    │
    └── renderer/         # React application
        ├── assets/         # Static assets
        ├── components/     # Reusable components
        │   ├── common/     # Shared components
        │   ├── dialogs/    # Dialog components
        │   └── qsl/        # QSL specific components
        │
        ├── hooks/         # Custom React hooks
        │   ├── useAppInitialization.js
        │   ├── useKeyboardShortcuts.js
        │   ├── useMenuHandlers.js
        │   └── useQSLDownload.js
        │
        ├── stores/        # State management
        ├── styles/         # Global styles
        ├── utils/          # Utility functions
        │   └── generateQSL.js
        │
        ├── App.jsx         # Root component
        └── main.jsx        # Renderer entry point
```

## Technology Stack

### Core Technologies
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Electron, Node.js
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git
- **CI/CD**: GitHub Actions

## System Requirements

- **OS**: Windows 10/11, macOS 10.14+, or Linux
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Disk Space**: 500MB minimum
- **RAM**: 2GB minimum (4GB recommended)

## Installation Guide

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (LTS version recommended)
2. Install [Git](https://git-scm.com/)
3. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lu9wt-qsl-creator.git
   cd lu9wt-qsl-creator
   ```

### Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Application
VITE_APP_NAME=QSL-Creator
VITE_APP_VERSION=1.0.0

# API (if applicable)
VITE_API_BASE_URL=http://localhost:3000/api

# Debug
VITE_DEBUG_MODE=true
```

### User Data

Application data is stored in the following locations:

- **Windows**: `%APPDATA%\lu9wt-qsl-creator`
- **macOS**: `~/Library/Application Support/lu9wt-qsl-creator`
- **Linux**: `~/.config/lu9wt-qsl-creator`

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run electron:dev` - Start Electron in development
- `npm run electron:build` - Build Electron app

### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Keep components small and focused
- Write tests for new features

## Build Instructions

### Development Build

```bash
npm run build:dev
```

### Production Builds

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

Builds will be available in the `dist` directory.

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- All contributors who have helped shape this project

---

Developed with ❤️ by LU9WT
