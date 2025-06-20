import PropTypes from 'prop-types'
import { useEffect } from 'react'
import '../styles/components/EmailStatusModal.css'

const EmailStatusModal = ({ isOpen, status, onClose }) => {
  // Auto-close on success after 3 seconds
  useEffect(() => {
    if (status === 'success' && isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose, isOpen])

  if (!isOpen) {
    return null
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'sending':
        return 'Enviando QSL...'
      case 'success':
        return '¡QSL enviada exitosamente!'
      case 'error':
        return 'Error al enviar la QSL. Por favor, intente nuevamente.'
      default:
        return ''
    }
  }

  const getStatusIconClass = () => `email-status-icon ${status || ''}`

  return (
    <div className="email-status-modal-overlay">
      <div className="email-status-modal-content">
        <div className="email-status-modal-header">
          <h3 className="email-status-modal-title">Estado del Envío</h3>
          <button onClick={onClose} className="email-status-modal-close">
            &times;
          </button>
        </div>
        <div className="email-status-modal-body">
          <div className={getStatusIconClass()}>
            {status === 'sending' && <div className="email-status-spinner" />}
            {status === 'success' && '✓'}
            {status === 'error' && '✕'}
          </div>
          <p className="email-status-message">{getStatusMessage()}</p>
        </div>
        {status === 'error' && (
          <div className="email-status-footer">
            <button onClick={onClose} className="email-status-button">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

EmailStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(['sending', 'success', 'error', '']),
  onClose: PropTypes.func.isRequired
}

export default EmailStatusModal
