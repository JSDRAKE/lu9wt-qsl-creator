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
    resetForm
  } = useQSLForm()

  const handleEmailSubmit = useCallback((email) => {
    console.log('Enviando QSL a:', email)
    // TODO: Implementar lógica de envío de correo
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
        />
      </div>

      <QSLManager
        generatedQSL={generatedQSL}
        onSendEmail={handleEmailSubmit}
        onDownload={() => console.log('Descargando QSL')}
      />
    </div>
  )
}

export default App
