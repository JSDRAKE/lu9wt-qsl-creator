import { useCallback, useState } from 'react'
import AboutDialog from './components/AboutDialog'
import Header from './components/Header'
import InitialSetupDialog from './components/InitialSetupDialog'
import QSLCardSelector from './components/QSLCardSelector'
import QSLForm from './components/QSLForm'
import QSLManager from './components/QSLManager'
import SettingsDialog from './components/SettingsDialog'
import UserDataDialog from './components/UserDataDialog'
import useAppInitialization from './hooks/useAppInitialization'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useMenuHandlers from './hooks/useMenuHandlers'
import useQSLDownload from './hooks/useQSLDownload'
import { useQSLForm } from './hooks/useQSLForm'

// Default profile will be created when needed in the settings dialog

function App() {
  // Grouped dialog states
  const [dialogs, setDialogs] = useState({
    about: false,
    settings: false,
    userData: false,
    initialSetup: false
  })

  const [appInfo, setAppInfo] = useState(null)
  const [, setIsFirstRun] = useState(false)

  // Custom hooks
  const {
    formData,
    generatedQSL,
    handleInputChange,
    handleTemplateChange,
    generateQSL,
    resetForm,
    errors
  } = useQSLForm()

  const { downloadQSL } = useQSLDownload()

  // Check if we need to show initial setup
  const checkInitialSetup = useCallback(async () => {
    try {
      const settings = await window.api.getSettings()
      if (settings === null) {
        // No settings file exists, show initial setup
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false // Ensure settings dialog is closed initially
        }))
        return
      }

      // Check if we have valid profiles
      const hasProfiles = settings?.profiles?.length > 0
      const hasActiveProfile = settings?.activeProfileId

      if (!hasProfiles || !hasActiveProfile) {
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false // Ensure settings dialog is closed initially
        }))
      }
    } catch (error) {
      console.error('Error checking initial setup:', error)
      setIsFirstRun(true)
      setDialogs((prev) => ({
        ...prev,
        initialSetup: true,
        settings: false // Ensure settings dialog is closed initially
      }))
    }
  }, [])

  // App initialization
  useAppInitialization(setAppInfo, checkInitialSetup)

  // Menu handlers
  useMenuHandlers(
    (show) => setDialogs((prev) => ({ ...prev, about: show })),
    (show) => setDialogs((prev) => ({ ...prev, settings: show })),
    (show) => setDialogs((prev) => ({ ...prev, userData: show }))
  )

  // Handle initial setup configuration
  const handleInitialConfigure = useCallback(() => {
    setDialogs({
      initialSetup: false,
      settings: true,
      about: false,
      userData: false
    })
  }, [])

  // Close initial setup
  const handleCloseInitialSetup = useCallback(() => {
    setDialogs((prev) => ({ ...prev, initialSetup: false }))
  }, [])

  // Close all dialogs
  const closeAllDialogs = useCallback(() => {
    setDialogs({
      about: false,
      settings: false,
      userData: false,
      initialSetup: false
    })
  }, [])

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    closeDialogs: () => {
      closeAllDialogs()
    }
  })

  // Email submission handler
  const handleEmailSubmit = useCallback((email) => {
    try {
      console.log('Sending QSL to:', email)
      // TODO: Implementar lógica de envío de correo
    } catch (error) {
      console.error('Error sending email:', error)
      // TODO: Mostrar notificación de error al usuario
    }
  }, [])

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

      {generatedQSL && (
        <QSLManager
          generatedQSL={generatedQSL}
          onSendEmail={handleEmailSubmit}
          onDownload={() => downloadQSL(generatedQSL)}
        />
      )}

      <AboutDialog
        isOpen={dialogs.about}
        onClose={() => setDialogs((prev) => ({ ...prev, about: false }))}
        appInfo={appInfo}
      />

      <SettingsDialog
        isOpen={dialogs.settings}
        onClose={() => setDialogs((prev) => ({ ...prev, settings: false }))}
      />

      <UserDataDialog
        isOpen={dialogs.userData}
        onClose={() => setDialogs((prev) => ({ ...prev, userData: false }))}
      />

      <InitialSetupDialog
        isOpen={dialogs.initialSetup}
        onClose={handleCloseInitialSetup}
        onConfigure={handleInitialConfigure}
      />
    </div>
  )
}

export default App
