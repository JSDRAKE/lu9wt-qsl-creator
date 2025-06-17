import { useEffect } from 'react'

export const useAppInitialization = (setAppInfo, onInitialized) => {
  useEffect(() => {
    const loadAppInfo = async () => {
      if (!window.electron?.ipcRenderer) return
      try {
        const info = await window.electron.ipcRenderer.invoke('get-app-info')
        setAppInfo(info)
      } catch (error) {
        console.error('Error loading application info:', error)
      }
    }

    const initializeApp = async () => {
      await loadAppInfo()
      if (typeof onInitialized === 'function') {
        await onInitialized()
      }
    }

    initializeApp()
  }, [setAppInfo, onInitialized])

  return {}
}

export default useAppInitialization
