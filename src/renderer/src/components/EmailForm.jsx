import { useState } from 'react'
import PropTypes from 'prop-types'
import '../styles/components/EmailForm.css'

const EmailForm = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      onSubmit(email)
      // Reset form after submission
      setEmail('')
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="email-form-container">
      <h2>Envia tu QSL</h2>

      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="email">Direccion de correo electronico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
            required
            disabled={isSubmitting}
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
  )
}

EmailForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default EmailForm
