import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

const EmailTab = ({ settings, onSettingsChange }) => {
  // Handle email authentication
  const handleEmailAuth = useCallback(async () => {
    try {
      // Simulate authentication (replace with actual OAuth2 flow)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSettingsChange({ emailVerified: true })
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }, [onSettingsChange])

  const handleDisconnect = useCallback(() => {
    onSettingsChange({ emailVerified: false })
  }, [onSettingsChange])

  return (
    <div className="tab-content" id="email-tabpanel">
      <div className="email-auth-container">
        <h3>Autenticación de Correo Electrónico</h3>
        <p className="email-auth-description">
          Conecta tu cuenta de correo electrónico para habilitar el envío de QSLs por email.
          Utilizamos OAuth2 para una conexión segura.
        </p>

        <div className="email-status">
          {settings.emailVerified ? (
            <div className="status-verified">
              <FiCheckCircle className="status-icon" />
              <span>Correo verificado: {settings.email || 'No configurado'}</span>
            </div>
          ) : (
            <div className="status-not-verified">
              <FiAlertCircle className="status-icon" />
              <span>No verificado</span>
            </div>
          )}
        </div>

        <div className="email-auth-actions">
          <button
            type="button"
            className={`btn ${settings.emailVerified ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleEmailAuth}
            disabled={!settings.email}
          >
            {settings.emailVerified ? 'Cambiar cuenta' : 'Conectar con Google'}
          </button>

          {settings.emailVerified && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDisconnect}
              style={{ marginLeft: '10px' }}
            >
              Desconectar
            </button>
          )}
        </div>

        {!settings.email && (
          <p className="email-auth-hint">
            Por favor, configura tu dirección de correo electrónico en la pestaña de Usuario
            primero.
          </p>
        )}
      </div>
    </div>
  )
}

EmailTab.propTypes = {
  settings: PropTypes.shape({
    email: PropTypes.string,
    emailVerified: PropTypes.bool
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired
}

export default EmailTab
