import { useState } from 'react'

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
      <h2>Send QSL by Email</h2>

      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@example.com"
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
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={!email || isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmailForm
