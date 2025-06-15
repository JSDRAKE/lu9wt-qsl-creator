import { useCallback, useEffect } from 'react'

export const useAppInitialization = (setAppInfo, setShowInitialDialog, setIsCheckingUserData) => {
  const checkUserData = useCallback(async () => {
    if (!window.electron?.ipcRenderer) return
    try {
      const { success, data } = await window.electron.ipcRenderer.invoke('check-user-data')
      if (!success || !data || Object.values(data).every((value) => !value)) {
        setShowInitialDialog(true)
      }
    } catch (error) {
      console.error('Error checking user data:', error)
    } finally {
      setIsCheckingUserData(false)
    }
  }, [setShowInitialDialog, setIsCheckingUserData])

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
    checkUserData()
  }, [checkUserData, setAppInfo])

  return { checkUserData }
}

export default useAppInitialization
