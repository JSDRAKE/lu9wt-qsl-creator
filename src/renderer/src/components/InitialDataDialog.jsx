import PropTypes from 'prop-types'
import { useEffect } from 'react'
import '../styles/dialogs/initial-data-dialog.css'

const InitialDataDialog = ({ isOpen, onClose, onOpenUserData }) => {
  // Handle escape key to close dialog
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  if (!isOpen) return null

  const handleOpenUserDataClick = () => {
    onClose() // Close the initial dialog first
    onOpenUserData() // Then open the user data dialog
  }

  return (
    <div className="initial-dialog-overlay">
      <div className="initial-dialog">
        <div className="initial-dialog-content">
          <h2>Bienvenido a LU9WT QSL Creator</h2>
          <p>No se encontraron datos de usuario. ¿Desea configurar sus datos ahora?</p>
          <div className="initial-dialog-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button className="btn btn-primary" onClick={handleOpenUserDataClick}>
              Cargar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

InitialDataDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenUserData: PropTypes.func.isRequired
}

export default InitialDataDialog
