import { useCallback, useEffect } from 'react'

export const useMenuHandlers = (setShowAbout, setShowSettings) => {
  const handleShowAbout = useCallback(() => setShowAbout(true), [setShowAbout])
  const handleShowSettings = useCallback(() => setShowSettings(true), [setShowSettings])
  const handleAddQSL = useCallback(() => {
    // TODO: Implement QSL addition logic
    console.log('Add new QSL')
  }, [])

  const handleDeleteQSL = useCallback(() => {
    // TODO: Implement QSL deletion logic
    console.log('Delete current QSL')
  }, [])

  useEffect(() => {
    if (!window.electron?.ipcRenderer) return

    const cleanupFunctions = []

    // Add event listeners and store cleanup functions
    const addListener = (event, handler) => {
      window.electron.ipcRenderer.on(event, handler)
      return () => window.electron.ipcRenderer.removeListener(event, handler)
    }

    cleanupFunctions.push(addListener('show-about-dialog', handleShowAbout))
    cleanupFunctions.push(addListener('show-settings-dialog', handleShowSettings))
    cleanupFunctions.push(addListener('menu-add-qsl', handleAddQSL))
    cleanupFunctions.push(addListener('menu-delete-qsl', handleDeleteQSL))

    // Return cleanup function that removes all listeners
    return () => {
      cleanupFunctions.forEach((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup()
        }
      })
    }
  }, [handleShowAbout, handleShowSettings, handleAddQSL, handleDeleteQSL])

  // No need to return anything as handlers are configured internally
}

export default useMenuHandlers
