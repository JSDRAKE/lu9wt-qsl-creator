import { useCallback, useEffect, useRef } from 'react'

export const useAppInitialization = (setAppInfo, onInitialized) => {
  const isInitialized = useRef(false)
  const isInitializing = useRef(false)

  const initializeApp = useCallback(async () => {
    // Evitar múltiples inicializaciones simultáneas
    if (isInitializing.current || isInitialized.current) return

    isInitializing.current = true

    try {
      // Cargar información de la aplicación
      if (window.electron?.ipcRenderer) {
        const info = await window.electron.ipcRenderer.invoke('get-app-info')
        setAppInfo(info)
      }

      // Ejecutar callback de inicialización si existe
      if (typeof onInitialized === 'function') {
        await onInitialized()
      }

      isInitialized.current = true
    } catch (error) {
      console.error('Error during app initialization:', error)
    } finally {
      isInitializing.current = false
    }
  }, [setAppInfo, onInitialized])

  useEffect(() => {
    initializeApp()

    // Limpieza al desmontar
    return () => {
      isInitializing.current = false
    }
  }, [initializeApp])

  return {
    isInitialized: isInitialized.current,
    reinitialize: useCallback(() => {
      isInitialized.current = false
      return initializeApp()
    }, [initializeApp])
  }
}

export default useAppInitialization
