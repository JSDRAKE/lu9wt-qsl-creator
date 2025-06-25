import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  // Settings API
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  // App Info
  getAppInfo: () => ipcRenderer.invoke('getAppInfo')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        on: (channel, listener) => ipcRenderer.on(channel, listener),
        removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  window.electron = { ipcRenderer }
  window.api = api
}
