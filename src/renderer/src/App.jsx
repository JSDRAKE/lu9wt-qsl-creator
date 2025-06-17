import { useCallback, useState } from 'react'
import AboutDialog from './components/AboutDialog'
import Header from './components/Header'
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

function App() {
  // Grouped dialog states
  const [dialogs, setDialogs] = useState({
    about: false,
    settings: false,
    userData: false
  })

  const [appInfo, setAppInfo] = useState(null)

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

  // App initialization
  useAppInitialization(setAppInfo)

  // Menu handlers
  useMenuHandlers(
    (show) => setDialogs((prev) => ({ ...prev, about: show })),
    (show) => setDialogs((prev) => ({ ...prev, settings: show })),
    (show) => setDialogs((prev) => ({ ...prev, userData: show }))
  )

  // Close all dialogs
  const closeAllDialogs = useCallback(() => {
    setDialogs({
      about: false,
      settings: false,
      userData: false
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
    </div>
  )
}

export default App
