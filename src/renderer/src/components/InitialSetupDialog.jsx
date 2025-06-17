import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { FiInfo, FiSettings } from 'react-icons/fi'
import '../styles/dialogs/initial-setup-dialog.css'

const InitialSetupDialog = ({ isOpen, onClose, onConfigure }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="initial-setup-dialog">
      <div className="modal-container">
        <div className="modal-header">
          <h2>LU9WT QSL Creator</h2>
        </div>
        <div className="modal-body">
          <div className="welcome-message">
            <div className="welcome-icon-container">
              <FiInfo className="welcome-icon" />
            </div>
            <div className="welcome-text">
              <h3>Configuración Inicial Requerida</h3>
              <p>
                Parece que es la primera vez que usas la aplicación o no hay configuración guardada.
                Por favor, configura tu perfil antes de comenzar a utilizar la aplicación.
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary" onClick={onConfigure}>
            <FiSettings className="button-icon" /> Configurar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}

InitialSetupDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfigure: PropTypes.func.isRequired
}

export default InitialSetupDialog
