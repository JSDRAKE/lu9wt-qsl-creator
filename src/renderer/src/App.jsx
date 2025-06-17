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
      console.log('Checking for settings file...')
      const response = await window.api.getSettings()
      console.log('Settings loaded:', response)

      // Check if the request was successful
      if (!response.success) {
        console.error('Error loading settings:', response.error)
        // Show initial setup in case of error
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
        return
      }

      const responseData = response.data

      // If no settings file exists, show initial setup
      if (responseData === null) {
        console.log('No settings file found, showing initial setup')
        setIsFirstRun(true)
        setDialogs((prev) => ({
          ...prev,
          initialSetup: true,
          settings: false
        }))
        return
      }

      // Extract the actual settings from the data object
      const settings = responseData.data || {}

      // Debug: Log the entire settings object
      console.log('Response data:', responseData)
      console.log('Settings object type:', typeof settings)
      console.log('Settings object keys:', Object.keys(settings || {}))
      console.log('Settings object content:', JSON.stringify(settings, null, 2))

      // Check if we have valid settings object with profiles
      if (!settings || typeof settings !== 'object') {
        console.log('Invalid settings format, showing initial setup')
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
