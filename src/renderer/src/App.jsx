import { useState } from 'react'
import EmailForm from './components/EmailForm'
import Header from './components/Header'
import QSLForm from './components/QSLForm'
import QSLGenerated from './components/QSLGenerated'
import QSLCardSelector from './components/QSLCardSelector'

function App() {
  const [formData, setFormData] = useState({
    callsign: '',
    date: '',
    time: '',
    frequency: '',
    report: '',
    mode: '',
    qslTemplate: ''
  })
  const [generatedQSL, setGeneratedQSL] = useState(null)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerateQSL = () => {
    // Aquí iría la lógica para generar la QSL
    setGeneratedQSL({
      ...formData,
      imageUrl: formData.qslTemplate // Por ahora usamos la URL de la plantilla
    })
  }

  const handleReset = () => {
    setFormData({
      callsign: '',
      date: '',
      time: '',
      frequency: '',
      report: '',
      mode: '',
      qslTemplate: ''
    })
    setGeneratedQSL(null)
    setShowEmailForm(false)
  }

  const handleSendEmail = () => {
    setShowEmailForm(true)
  }

  const handleBack = () => {
    setShowEmailForm(false)
  }

  const handleEmailSubmit = (email) => {
    // Aquí iría la lógica para enviar el correo
    console.log('Enviando QSL a:', email)
  }

  return (
    <div className="container">
      <Header />

      <div className="content">
        <QSLForm
          formData={formData}
          onInputChange={handleInputChange}
          onGenerate={handleGenerateQSL}
          onReset={handleReset}
        />

        <QSLCardSelector
          qslTemplate={formData.qslTemplate}
          onTemplateChange={(value) => setFormData((prev) => ({ ...prev, qslTemplate: value }))}
        />
      </div>

      {generatedQSL && (
        <QSLGenerated
          qslData={generatedQSL}
          onDownload={() => console.log('Descargando QSL')}
          onSend={handleSendEmail}
        />
      )}

      {showEmailForm && <EmailForm onBack={handleBack} onSubmit={handleEmailSubmit} />}
    </div>
  )
}

export default App
