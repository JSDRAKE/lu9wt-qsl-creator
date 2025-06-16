import PropTypes from 'prop-types'
import { useState } from 'react'
import '../styles/components/QSLManager.css'
import EmailForm from './EmailForm'
import QSLGenerated from './QSLGenerated'

const QSLManager = ({ generatedQSL, onSendEmail, onDownload }) => {
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleSend = () => {
    setShowEmailForm(true)
  }

  const handleEmailSubmit = (email) => {
    onSendEmail(email)
    setShowEmailForm(false)
  }

  const handleBack = () => {
    setShowEmailForm(false)
  }

  if (!generatedQSL) return null

  if (showEmailForm) {
    return <EmailForm onBack={handleBack} onSubmit={handleEmailSubmit} />
  }

  return <QSLGenerated qslData={generatedQSL} onDownload={onDownload} onSend={handleSend} />
}

QSLManager.propTypes = {
  generatedQSL: PropTypes.object,
  onSendEmail: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

export default QSLManager
