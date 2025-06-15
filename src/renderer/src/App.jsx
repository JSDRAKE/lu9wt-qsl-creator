import { useCallback } from 'react'
import Header from './components/Header'
import QSLCardSelector from './components/QSLCardSelector'
import QSLForm from './components/QSLForm'
import QSLManager from './components/QSLManager'
import { useQSLForm } from './hooks/useQSLForm'

function App() {
  const {
    formData,
    generatedQSL,
    handleInputChange,
    handleTemplateChange,
    generateQSL,
    resetForm,
    errors
  } = useQSLForm()

  const handleEmailSubmit = useCallback((email) => {
    console.log('Enviando QSL a:', email)
    // TODO: Implementar lógica de envío de correo
  }, [])

  const handleDownloadQSL = useCallback(() => {
    if (!generatedQSL?.imageUrl) return

    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = generatedQSL.imageUrl

    // Create a filename with the callsign and current date
    const date = new Date().toISOString().split('T')[0]
    const filename = `QSL-${generatedQSL.callsign || 'unknown'}-${generatedQSL.mode}-${date}.jpg`

    // Set the download attribute and trigger the click
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [generatedQSL])

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
    </div>
  )
}

export default App
