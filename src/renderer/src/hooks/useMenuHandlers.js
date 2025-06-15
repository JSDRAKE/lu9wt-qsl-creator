import { useCallback, useEffect } from 'react'

export const useMenuHandlers = (setShowAbout, setShowSettings, setShowUserData) => {
  const handleShowAbout = useCallback(() => setShowAbout(true), [setShowAbout])
  const handleShowSettings = useCallback(() => setShowSettings(true), [setShowSettings])
  const handleUserData = useCallback(() => setShowUserData(true), [setShowUserData])
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

    const cleanupIpc = [
      window.electron.ipcRenderer.on('show-about-dialog', handleShowAbout),
      window.electron.ipcRenderer.on('show-settings-dialog', handleShowSettings),
      window.electron.ipcRenderer.on('menu-add-qsl', handleAddQSL),
      window.electron.ipcRenderer.on('menu-delete-qsl', handleDeleteQSL),
      window.electron.ipcRenderer.on('menu-user-data', handleUserData)
    ]

    return () => cleanupIpc.forEach((cleanup) => cleanup?.())
  }, [handleShowAbout, handleShowSettings, handleUserData, handleAddQSL, handleDeleteQSL])

  // No need to return anything as handlers are configured internally
}

export default useMenuHandlers
