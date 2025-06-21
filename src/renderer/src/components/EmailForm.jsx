import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { getEmailFromCallsign } from '../utils/qrzApi'
import '../styles/components/EmailForm.css'
import EmailStatusModal from './EmailStatusModal'

const EmailForm = ({ onBack, onSubmit, qrzCallsign, onInputChange = () => {} }) => {
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('es') // Default to Spanish
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [emailStatus, setEmailStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const handleCloseModal = useCallback(() => {
    // Solo restablecer el estado de envío si no hay un envío en progreso
    if (emailStatus !== 'sending') {
      setIsSubmitting(false)
    }
    setShowStatusModal(false)
    // No restablecer emailStatus aquí para permitir la transición de cierre
  }, [emailStatus])

  // Lookup email from QRZ when component mounts or when callsign changes
  useEffect(() => {
    const fetchEmailFromQRZ = async () => {
      if (!qrzCallsign) return

      setIsLookingUp(true)
      setStatusMessage(`Buscando correo electrónico para ${qrzCallsign} en QRZ...`)

      try {
        const result = await getEmailFromCallsign(qrzCallsign)

        if (result.success && result.email) {
          setEmail(result.email)
          setStatusMessage(
            `¡Correo electrónico encontrado para ${result.callsign}${
              result.name ? ` (${result.name})` : ''
            }!`
          )

          // Guardar el nombre del operador en el estado del formulario
          if (result.name) {
            // Actualizar el estado del formulario con el nombre del operador
            const event = {
              target: {
                name: 'operatorName',
                value: result.name
              }
            }
            // Llamar al manejador de cambios para actualizar el estado del formulario
            onInputChange(event)
          }
        } else {
          setStatusMessage(result.error || 'No se encontró correo electrónico en QRZ')
        }
      } catch (error) {
        console.error('Error fetching email from QRZ:', error)
        setStatusMessage('Error al buscar el correo en QRZ')
      } finally {
        setIsLookingUp(false)
      }
    }

    fetchEmailFromQRZ()
  }, [qrzCallsign, onInputChange])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!email || isSubmitting) return

      // Iniciar el estado de envío
      setIsSubmitting(true)
      setShowStatusModal(true)
      setEmailStatus('sending')
      setStatusMessage(language === 'es' ? 'Enviando correo electrónico...' : 'Sending email...')

      try {
        await onSubmit(email, language)
        // Envío exitoso
        setEmailStatus('success')
        const successMessage = {
          es: '¡Correo electrónico enviado con éxito!',
          en: 'Email sent successfully!'
        }
        setStatusMessage(successMessage[language] || successMessage.es)
        setEmail('') // Limpiar el campo de correo después de un envío exitoso

        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
          setShowStatusModal(false)
          setIsSubmitting(false)
          setStatusMessage('')
        }, 3000)
      } catch (error) {
        console.error('Error sending email:', error)
        setEmailStatus('error')
        const errorMessage = {
          es: 'Error al enviar el correo electrónico. Por favor, inténtalo de nuevo.',
          en: 'Error sending email. Please try again.'
        }
        setStatusMessage(errorMessage[language] || errorMessage.es)
        setIsSubmitting(false) // Permitir reintentar en caso de error
      }
    },
    [email, onSubmit, isSubmitting, language]
  )

  return (
    <>
      <div className="email-form-container">
        <h2>Enviar QSL por Correo</h2>
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico del Destinatario</label>
            <div className="email-input-container">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@email.com"
                required
                disabled={isSubmitting || isLookingUp}
                className="form-input"
              />
              {qrzCallsign && isLookingUp && <span className="qrz-status">Buscando en QRZ...</span>}
              {statusMessage && !isLookingUp && (
                <div className={`status-message ${emailStatus || ''}`.trim()}>{statusMessage}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="language">Idioma del Correo</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
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
      <EmailStatusModal
        isOpen={showStatusModal}
        status={emailStatus}
        message={statusMessage}
        onClose={handleCloseModal}
      />
    </>
  )
}

EmailForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, // Should accept (email, language) parameters
  qrzCallsign: PropTypes.string,
  onInputChange: PropTypes.func
}

export default EmailForm
