import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import EmailStatusModal from './EmailStatusModal'
import '../styles/components/EmailForm.css'

const EmailForm = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [emailStatus, setEmailStatus] = useState('')
  const handleCloseModal = useCallback(() => {
    setShowStatusModal(false)
    setEmailStatus('')
  }, [setShowStatusModal, setEmailStatus])

  const updateModalState = useCallback(
    (_, __, stateUpdate = {}) => {
      if (stateUpdate.showStatusModal !== undefined) {
        setShowStatusModal(stateUpdate.showStatusModal)
      }
      if (stateUpdate.emailStatus !== undefined) {
        setEmailStatus(stateUpdate.emailStatus)
      }
      if (stateUpdate.isSubmitting !== undefined) {
        setIsSubmitting(stateUpdate.isSubmitting)
      }
    },
    [setShowStatusModal, setEmailStatus, setIsSubmitting]
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!email) return

      updateModalState('sending', 'Opening modal with status: sending', {
        showStatusModal: true,
        emailStatus: 'sending',
        isSubmitting: true
      })

      try {
        await onSubmit(email)
        updateModalState('success', 'Email sent successfully, updating status to success', {
          emailStatus: 'success'
        })
        setEmail('') // Clear the email field after successful submission
      } catch (error) {
        console.error('Error sending email:', error)
        updateModalState('error', 'Error occurred, updating status to error', {
          emailStatus: 'error',
          isSubmitting: false
        })
      }
    },
    [email, onSubmit, updateModalState]
  )

  return (
    <div className="email-form-container">
      <h2>Enviar QSL por Correo</h2>
      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico del Destinatario</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
            required
            disabled={isSubmitting}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button type="submit" className="btn btn-primary" disabled={!email || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar QSL'}
          </button>
        </div>
      </form>
      <EmailStatusModal isOpen={showStatusModal} status={emailStatus} onClose={handleCloseModal} />
    </div>
  )
}

EmailForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default EmailForm
