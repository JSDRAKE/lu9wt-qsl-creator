import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail, FiXCircle } from 'react-icons/fi'
import '../../styles/components/tabs/email-tab.css'

const EmailTab = ({ settings, onSettingsChange }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Validate email format
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  // Handle email authentication
  const handleEmailAuth = useCallback(async () => {
    if (!settings.email) {
      setError('Por favor, configura tu dirección de correo electrónico primero')
      return
    }

    if (!isValidEmail(settings.email)) {
      setError('Por favor, ingresa una dirección de correo electrónico válida')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Simulate authentication (replace with actual OAuth2 flow)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% chance of failure for demo purposes
          if (Math.random() < 0.1) {
            reject(new Error('Error de conexión con el servidor de autenticación'))
          } else {
            resolve()
          }
        }, 1500)
      })

      onSettingsChange({
        emailVerified: true,
        lastVerified: new Date().toISOString()
      })
    } catch (err) {
      console.error('Authentication failed:', err)
      setError(err.message || 'Error al conectar con el servicio de autenticación')
    } finally {
      setIsLoading(false)
    }
  }, [onSettingsChange, settings.email])

  const handleDisconnect = useCallback(() => {
    onSettingsChange({
      emailVerified: false,
      email: settings.email // Keep the email but mark as unverified
    })
  }, [onSettingsChange, settings.email])

  return (
    <div className="tab-content email-tab" id="email-tabpanel">
      <div className="email-auth-container">
        <div className="email-scrollable">
          <div className="scrollable-content">
            <h3>Autenticación de Correo Electrónico</h3>
            <p className="email-auth-description">
              Conecta tu cuenta de correo electrónico para habilitar el envío de QSLs por email.
              Utilizamos OAuth2 para una conexión segura.
            </p>

            <div className="email-status">
              {settings.emailVerified ? (
                <div className="status-verified">
                  <FiCheckCircle className="status-icon" />
                  <div className="status-content">
                    <span className="status-label">Correo verificado</span>
                    <span className="status-email">
                      <FiMail className="email-icon" />
                      {settings.email}
                    </span>
                    {settings.lastVerified && (
                      <span className="status-timestamp">
                        Verificado el: {new Date(settings.lastVerified).toLocaleString('es-AR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="status-not-verified">
                  <FiAlertCircle className="status-icon" />
                  <div className="status-content">
                    <span className="status-label">No verificado</span>
                    {settings.email ? (
                      <span className="status-email">
                        <FiMail className="email-icon" />
                        {settings.email}
                      </span>
                    ) : (
                      <span className="status-message">No hay correo electrónico configurado</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="email-auth-actions">
              {!settings.emailVerified && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEmailAuth}
                  disabled={isLoading || !settings.email}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    'Conectar con Google'
                  )}
                </button>
              )}

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

            {error && (
              <div className="error-message">
                <FiXCircle className="error-icon" />
                <span>{error}</span>
              </div>
            )}
            {!settings.email && (
              <div className="email-auth-hint">
                <FiAlertCircle className="hint-icon" />
                <p>
                  Por favor, configura tu dirección de correo electrónico en la pestaña de Usuario
                  primero.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

EmailTab.propTypes = {
  settings: PropTypes.shape({
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    lastVerified: PropTypes.string
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired
}

export default EmailTab
