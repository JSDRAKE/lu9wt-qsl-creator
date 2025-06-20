import PropTypes from 'prop-types'
import { useEffect } from 'react'
import '../styles/components/EmailStatusModal.css'

const EmailStatusModal = ({ isOpen, status, message, onClose }) => {
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
    // Use custom message if provided, otherwise use default messages
    if (message) return message

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
    <div className="email-status-modal-overlay" onClick={onClose}>
      <div className="email-status-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="email-status-modal-header">
          <h3 className="email-status-modal-title">Estado del Envío</h3>
          <button onClick={onClose} className="email-status-modal-close" aria-label="Cerrar modal">
            &times;
          </button>
        </div>
        <div className="email-status-modal-body">
          <div className={getStatusIconClass()} aria-hidden="true">
            {status === 'sending' && <div className="email-status-spinner" />}
            {status === 'success' && '✓'}
            {status === 'error' && '✕'}
          </div>
          <p className="email-status-message">{getStatusMessage()}</p>
        </div>
        {status === 'error' && (
          <div className="email-status-footer">
            <button onClick={onClose} className="email-status-button" autoFocus>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

EmailStatusModal.defaultProps = {
  status: '',
  message: ''
}

EmailStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(['sending', 'success', 'error', '']),
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

export default EmailStatusModal
