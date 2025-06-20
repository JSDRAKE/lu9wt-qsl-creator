import PropTypes from 'prop-types'
import { useState } from 'react'
import '../styles/components/QSLManager.css'
import EmailForm from './EmailForm'
import QSLGenerated from './QSLGenerated'

const QSLManager = ({ generatedQSL, onSendEmail, onDownload, onInputChange }) => {
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleSend = () => {
    setShowEmailForm(true)
  }

  const handleEmailSubmit = async (email) => {
    try {
      await onSendEmail(email)
      // No cerramos el formulario aquí, dejamos que EmailForm maneje el cierre
      // después de que se complete el envío exitosamente
    } catch (error) {
      console.error('Error en handleEmailSubmit:', error)
      // Dejamos que EmailForm maneje el estado de error
      throw error // Re-lanzamos el error para que EmailForm lo maneje
    }
  }

  const handleBack = () => {
    setShowEmailForm(false)
  }

  if (!generatedQSL) return null

  if (showEmailForm) {
    return (
      <EmailForm
        onBack={handleBack}
        onSubmit={handleEmailSubmit}
        qrzCallsign={generatedQSL.callsign}
        onInputChange={onInputChange}
      />
    )
  }

  return <QSLGenerated qslData={generatedQSL} onDownload={onDownload} onSend={handleSend} />
}

QSLManager.propTypes = {
  generatedQSL: PropTypes.object,
  onSendEmail: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onInputChange: PropTypes.func
}

export default QSLManager
