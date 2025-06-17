import { useEffect } from 'react'

export const useAppInitialization = (setAppInfo) => {
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

    loadAppInfo()
  }, [setAppInfo])

  return {}
}

export default useAppInitialization
