import { useState } from 'react'
import PropTypes from 'prop-types'
import QSLGenerated from './QSLGenerated'
import EmailForm from './EmailForm'

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
