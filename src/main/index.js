import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { getUserData, saveUserData } from './userData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const icon = join(__dirname, '../../resources/icon.png')
const packageInfo = require('../../package.json')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
function createMenu() {
  // Crear plantilla del menú
  const template = [
    // Menú de la aplicación (solo en macOS)
    ...(process.platform === 'darwin'
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: 'Acerca de QSL Creator',
                click: () => {
                  const focusedWindow = BrowserWindow.getFocusedWindow()
                  if (focusedWindow) {
                    focusedWindow.webContents.send('show-about-dialog')
                  }
                }
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),

    // File Menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Agregar QSL',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-add-qsl')
            }
          }
        },
        {
          label: 'Eliminar QSL',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-delete-qsl')
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Datos del usuario',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-user-data')
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Configuración',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('show-settings-dialog')
            }
          }
        },
        { type: 'separator' },
        { role: 'close', label: 'Close Window' }
      ]
    },

    // Menú Edición
    {
      label: 'Edición',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        ...(process.platform === 'darwin'
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Dictado',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
              }
            ]
          : [
              { role: 'delete' },
              { type: 'separator' },
              { role: 'selectAll', label: 'Seleccionar todo' }
            ])
      ]
    },

    // Menú Ver
    {
      label: 'Ver',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // Menú Ventana
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin'
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ]
    },

    // Menú Ayuda
    {
      role: 'help',
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de QSL Creator',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('show-about-dialog')
            }
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Crear menú de la aplicación
  createMenu()

  // Manejar la solicitud de información de la aplicación
  ipcMain.handle('get-app-info', () => ({
    name: packageInfo.name,
    displayName: packageInfo.displayName || packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    author: packageInfo.author,
    homepage: packageInfo.homepage,
    bugs: packageInfo.bugs?.url || packageInfo.bugs,
    license: packageInfo.license
  }))

  // User data handlers
  ipcMain.handle('check-user-data', async () => {
    try {
      const data = await getUserData()
      return { success: true, data }
    } catch (error) {
      console.error('Error checking user data:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-user-data', async () => {
    try {
      const data = await getUserData()
      return { success: true, data }
    } catch (error) {
      console.error('Error in get-user-data:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('save-user-data', async (event, data) => {
    try {
      const savedData = await saveUserData(data)
      return { success: true, data: savedData }
    } catch (error) {
      console.error('Error in save-user-data:', error)
      return { success: false, error: error.message }
    }
  })

  // Manejar la solicitud de configuración
  ipcMain.handle('get-settings', () => {
    // Aquí puedes cargar la configuración desde un archivo o base de datos
    return {
      theme: 'light',
      language: 'es',
      autoSave: true,
      autoUpdate: true
    }
  })

  ipcMain.handle('save-settings', (_, settings) => {
    // Aquí puedes guardar la configuración en un archivo o base de datos
    console.log('Configuración guardada:', settings)
    return { success: true }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
