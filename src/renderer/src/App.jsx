import { useCallback, useEffect, useState } from 'react'
import AboutDialog from './components/AboutDialog'
import SettingsDialog from './components/SettingsDialog'
import Header from './components/Header'
import QSLCardSelector from './components/QSLCardSelector'
import QSLForm from './components/QSLForm'
import QSLManager from './components/QSLManager'
import { useQSLForm } from './hooks/useQSLForm'

function App() {
  const [showAbout, setShowAbout] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [appInfo, setAppInfo] = useState(null)

  const {
    formData,
    generatedQSL,
    handleInputChange,
    handleTemplateChange,
    generateQSL,
    resetForm,
    errors
  } = useQSLForm()

  // Load application info once
  useEffect(() => {
    const loadAppInfo = async () => {
      if (!window.electron?.ipcRenderer || appInfo) return
      try {
        const info = await window.electron.ipcRenderer.invoke('get-app-info')
        setAppInfo(info)
      } catch (error) {
        console.error('Error loading application info:', error)
      }
    }
    loadAppInfo()
  }, [appInfo])

  // Handle About dialog
  const handleShowAbout = useCallback(() => setShowAbout(true), [])

  // Handle Settings dialog
  const handleShowSettings = useCallback(() => setShowSettings(true), [])

  // Menu event handlers
  const handleAddQSL = useCallback(() => {
    // Logic to add a new QSL
    console.log('Add new QSL')
    // TODO: Implement QSL addition logic
  }, [])

  const handleDeleteQSL = useCallback(() => {
    // Logic to delete current/selected QSL
    console.log('Delete current QSL')
    // TODO: Implement QSL deletion logic
  }, [])

  const handleUserData = useCallback(() => {
    // Logic to show/edit user data
    console.log('Show/edit user data')
    // TODO: Implement user data logic
  }, [])

  // Set up keyboard and application event listeners
  useEffect(() => {
    if (!window.electron?.ipcRenderer) return

    // Set up IPC listeners
    const cleanupIpc = [
      window.electron.ipcRenderer.on('show-about-dialog', handleShowAbout),
      window.electron.ipcRenderer.on('show-settings-dialog', handleShowSettings),
      window.electron.ipcRenderer.on('menu-add-qsl', handleAddQSL),
      window.electron.ipcRenderer.on('menu-delete-qsl', handleDeleteQSL),
      window.electron.ipcRenderer.on('menu-user-data', handleUserData)
    ]

    // Set up keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAbout(false)
        setShowSettings(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      cleanupIpc.forEach((cleanup) => cleanup?.())
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleShowAbout, handleShowSettings, handleAddQSL, handleDeleteQSL, handleUserData])

  const handleEmailSubmit = (email) => {
    console.log('Sending QSL to:', email)
    // TODO: Implement email sending logic
  }

  const handleDownloadQSL = () => {
    if (!generatedQSL?.imageUrl) return

    const link = document.createElement('a')
    link.href = generatedQSL.imageUrl
    const date = new Date().toISOString().split('T')[0]
    link.download = `QSL-${generatedQSL.callsign || 'unknown'}-${generatedQSL.mode}-${date}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <QSLForm
          formData={formData}
          onInputChange={handleInputChange}
          onGenerate={generateQSL}
          onReset={resetForm}
        />

        <QSLCardSelector
          qslTemplate={formData.qslTemplate}
          onTemplateChange={handleTemplateChange}
          error={errors?.qslTemplate}
        />
      </div>

      <QSLManager
        generatedQSL={generatedQSL}
        onSendEmail={handleEmailSubmit}
        onDownload={handleDownloadQSL}
      />

      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} appInfo={appInfo} />
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default App
