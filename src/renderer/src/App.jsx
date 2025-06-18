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

  // Verificar si necesitamos mostrar la configuración inicial
  const checkInitialSetup = useCallback(async () => {
    try {
      const response = await window.api.getSettings()

      // Verificar si la petición fue exitosa
      if (!response.success) {
        console.error('Error al cargar configuraciones:', response.error)
        // Mostrar configuración inicial en caso de error
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
        return
      }

      const responseData = response.data

      // Si no existe el archivo de configuraciones, mostrar configuración inicial
      if (responseData === null) {
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
        return
      }

      // Extraer las configuraciones del objeto de respuesta
      const settings = responseData.data || {}

      // Verificar si tenemos un objeto de configuraciones válido con perfiles
      if (!settings || typeof settings !== 'object') {
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
        return
      }

      // Extract profiles and active profile ID from settings
      const { profiles = [], activeProfileId } = settings
      console.log('Extracted profiles:', profiles)
      console.log('Extracted activeProfileId:', activeProfileId)

      console.log('Settings structure is valid, checking profiles...')
      console.log('Profiles array exists:', Array.isArray(profiles))
      console.log('Number of profiles:', profiles.length)
      console.log('Active profile ID:', activeProfileId)

      // Check if we have valid profiles array and active profile
      const hasValidProfiles = Array.isArray(profiles) && profiles.length > 0
      let hasValidActiveProfile = false

      if (hasValidProfiles && activeProfileId) {
        hasValidActiveProfile = profiles.some((profile) => profile.id === activeProfileId)
      }

      if (!hasValidProfiles || !hasValidActiveProfile) {
        console.log('No valid profiles found, showing initial setup')
        console.log('hasValidProfiles:', hasValidProfiles)
        console.log('hasValidActiveProfile:', hasValidActiveProfile)
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
      } else {
        console.log('Valid settings and profiles found, skipping initial setup')
        console.log('hasValidProfiles:', hasValidProfiles)
        console.log('hasValidActiveProfile:', hasValidActiveProfile)
        setIsFirstRun(false)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: false
        }))
      }
    } catch (error) {
      console.error('Error checking initial setup:', error)
      // In case of error, don't block the app, just log and continue
      console.log('Error occurred, defaulting to no initial setup')
      setIsFirstRun(false)
      setDialogs((prev) => ({
        ...prev,
        initialSetup: false
      }))
    }
  }, [])

  // App initialization
  useAppInitialization(setAppInfo, checkInitialSetup)

  // Menu handlers - Memoize the handlers to prevent unnecessary recreations
  const handleShowAbout = useCallback(
    (show) => setDialogs((prev) => ({ ...prev, about: show })),
    []
  )
  const handleShowSettings = useCallback(
    (show) => setDialogs((prev) => ({ ...prev, settings: show })),
    []
  )
  const handleShowUserData = useCallback(
    (show) => setDialogs((prev) => ({ ...prev, userData: show })),
    []
  )

  // Initialize menu handlers once with memoized callbacks
  useMenuHandlers(handleShowAbout, handleShowSettings, handleShowUserData)

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
