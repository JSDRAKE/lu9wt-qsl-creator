import PropTypes from 'prop-types'
import { FcGoogle } from 'react-icons/fc'
import authService from '../../services/authService'

const GoogleAuthButton = ({ onSuccess, onError, disabled = false }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await authService.loginWithGoogle()
      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error('Google authentication error:', error)
      if (onError) onError(error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled}
      className="google-auth-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 16px',
        backgroundColor: '#fff',
        color: '#5F6368',
        border: '1px solid #DADCE0',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        transition: 'background-color 0.2s',
        width: '100%',
        maxWidth: '240px',
        '&:hover': {
          backgroundColor: '#F8F9FA',
          boxShadow: '0 1px 3px 1px rgba(66, 64, 67, 0.15)'
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed'
        }
      }}
    >
      <FcGoogle size={20} />
      <span>Conectar con Google</span>
    </button>
  )
}

GoogleAuthButton.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  disabled: PropTypes.bool
}

export default GoogleAuthButton
