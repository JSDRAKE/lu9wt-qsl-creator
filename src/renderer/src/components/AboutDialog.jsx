import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import '../styles/about-dialog.css'

const AboutDialog = ({ isOpen, onClose, appInfo }) => {
  // Cerrar con la tecla ESC
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    },
    [onClose, isOpen]
  )

  // Agregar y remover el event listener para la tecla ESC
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isOpen])

  // Controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen || !appInfo) return null

  return (
    <div className="about-modal-overlay">
      <div className="about-modal">
        <div className="about-modal-header">
          <h2>Acerca de </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="about-modal-content">
          <div className="about-header">
            <div className="app-icon">
              <img src="/icon.png" alt={appInfo.name} width="80" height="80" />
            </div>
            <div className="app-info">
              <h1>{appInfo.displayName || appInfo.name}</h1>
              <p className="app-version">Versión {appInfo.version}</p>
              {appInfo.description && <p className="app-description">{appInfo.description}</p>}
            </div>
          </div>

          <div className="about-details">
            {appInfo.author && (
              <div className="detail-row">
                <span className="detail-label">Autor:</span>
                <span className="detail-value">{appInfo.author}</span>
              </div>
            )}
            {appInfo.license && (
              <div className="detail-row">
                <span className="detail-label">Licencia:</span>
                <span className="detail-value">{appInfo.license}</span>
              </div>
            )}
            {appInfo.homepage && (
              <div className="detail-row">
                <span className="detail-label">Sitio web:</span>
                <a
                  href={appInfo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  {new URL(appInfo.homepage).hostname}
                </a>
              </div>
            )}
            {appInfo.bugs && (
              <div className="detail-row">
                <span className="detail-label">Reportar un problema:</span>
                <a
                  href={appInfo.bugs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  {new URL(appInfo.bugs).hostname}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

AboutDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appInfo: PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string,
    version: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    homepage: PropTypes.string,
    bugs: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    license: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  })
}

AboutDialog.defaultProps = {
  appInfo: null
}

export default AboutDialog
