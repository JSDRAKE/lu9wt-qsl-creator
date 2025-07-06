import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail, FiXCircle } from 'react-icons/fi'
import authService from '../../services/authService'
import '../../styles/components/tabs/email-tab.css'
import GoogleAuthButton from '../auth/GoogleAuthButton'

const EmailTab = ({ settings, onSettingsChange }) => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const profile = authService.getProfile()
      setUserProfile(profile)

      if (profile && profile.email) {
        onSettingsChange({
          email: profile.email,
          emailVerified: true,
          lastVerified: new Date().toISOString()
        })
      }
    }
  }, [onSettingsChange])

  // eslint-disable-next-line no-unused-vars
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  // Manejador de éxito de autenticación con Google
  const handleGoogleAuthSuccess = useCallback(
    (userData) => {
      setUserProfile(userData)
      setError(null)

      // Actualizar el estado del componente padre
      onSettingsChange({
        email: userData.email,
        emailVerified: true,
        lastVerified: new Date().toISOString()
      })
    },
    [onSettingsChange]
  )

  // Manejador de errores de autenticación con Google
  const handleGoogleAuthError = useCallback((error) => {
    console.error('Google authentication error:', error)
    setError(error.message || 'Error al autenticar con Google')
  }, [])

  const handleDisconnect = useCallback(() => {
    // Cerrar sesión en el servicio de autenticación
    authService.logout()

    // Limpiar el estado local
    setUserProfile(null)

    // Actualizar el estado del componente padre
    onSettingsChange({
      email: settings.email,
      emailVerified: false,
      lastVerified: null
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
                        Verificado el:{' '}
                        {new Date(settings.lastVerified).toLocaleString('es-AR', {
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
                <div className="google-auth-container">
                  <GoogleAuthButton
                    onSuccess={handleGoogleAuthSuccess}
                    onError={handleGoogleAuthError}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="loading-overlay">
                      <FiLoader className="spin" />
                      <span>Conectando con Google...</span>
                    </div>
                  )}
                </div>
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
