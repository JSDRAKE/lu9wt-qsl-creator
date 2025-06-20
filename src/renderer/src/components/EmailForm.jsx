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
    // Solo restablecer el estado de envío si no hay un envío en progreso
    if (emailStatus !== 'sending') {
      setIsSubmitting(false)
    }
    setShowStatusModal(false)
    // No restablecer emailStatus aquí para permitir la transición de cierre
  }, [emailStatus])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!email || isSubmitting) return

      // Iniciar el estado de envío
      setIsSubmitting(true)
      setShowStatusModal(true)
      setEmailStatus('sending')

      try {
        await onSubmit(email)
        // Envío exitoso
        setEmailStatus('success')
        setEmail('') // Limpiar el campo de correo después de un envío exitoso

        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
          setShowStatusModal(false)
          setIsSubmitting(false)
        }, 3000)
      } catch (error) {
        console.error('Error sending email:', error)
        setEmailStatus('error')
        setIsSubmitting(false) // Permitir reintentar en caso de error
      }
    },
    [email, onSubmit, isSubmitting]
  )

  return (
    <>
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
      </div>
      <EmailStatusModal isOpen={showStatusModal} status={emailStatus} onClose={handleCloseModal} />
    </>
  )
}

EmailForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default EmailForm
