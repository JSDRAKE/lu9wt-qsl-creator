import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { FiExternalLink, FiGithub, FiGlobe, FiMail, FiX } from 'react-icons/fi'
import '../styles/dialogs/about-dialog.css'

const AboutDialog = ({ isOpen, onClose, appInfo }) => {
  const {
    displayName,
    version,
    author,
    homepage,
    description,
    email,
    name: packageName
  } = appInfo || {}

  const currentYear = new Date().getFullYear()
  const repoUrl = `https://github.com/JSDRAKE/${packageName}`

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="about-dialog" onClick={onClose} role="presentation" tabIndex="-1">
      <div
        className="about-dialog__modal"
        onClick={handleModalClick}
        role="dialog"
        aria-labelledby="about-dialog-title"
        aria-modal="true"
        tabIndex="-1"
      >
        <div className="about-dialog__header">
          <h2 id="about-dialog-title" className="about-dialog__title">
            ACERCA DE
          </h2>
          <button
            className="about-dialog__close-button"
            onClick={onClose}
            aria-label="Cerrar diálogo"
            type="button"
          >
            <FiX aria-hidden />
          </button>
        </div>

        <div className="about-dialog__content">
          <div className="about-dialog__app-brand">
            <div className="about-dialog__logo" aria-hidden>
              <div className="about-dialog__logo-inner" />
            </div>
            <h3 className="about-dialog__app-name">{displayName}</h3>
            {version && (
              <p className="about-dialog__app-version">
                Versión <span className="about-dialog__version-number">{version}</span>
              </p>
            )}
          </div>

          <div className="about-dialog__description">
            <p>
              {description ||
                'Herramienta profesional para la creación y gestión de tarjetas QSL para radioaficionados. Diseñada para ser intuitiva y eficiente, permitiendo a los operadores generar tarjetas QSL personalizadas con información de contacto y detalles de QSO.'}
            </p>
          </div>

          <div className="about-dialog__metadata">
            <div className="about-dialog__metadata-item">
              <span className="about-dialog__metadata-label">Autor</span>
              <span className="about-dialog__metadata-value">{author || 'No disponible'}</span>
            </div>
            {version && (
              <div className="about-dialog__metadata-item">
                <span className="about-dialog__metadata-label">Versión</span>
                <span className="about-dialog__metadata-value">{version}</span>
              </div>
            )}
            {repoUrl && (
              <div className="about-dialog__metadata-item">
                <span className="about-dialog__metadata-label">GitHub</span>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-dialog__link"
                  aria-label="Ver repositorio en GitHub (se abre en una nueva pestaña)"
                >
                  <FiGithub className="about-dialog__link-icon" aria-hidden />
                  <span>Repositorio</span>
                  <FiExternalLink className="about-dialog__external-icon" aria-hidden />
                </a>
              </div>
            )}
            {homepage && (
              <div className="about-dialog__metadata-item">
                <span className="about-dialog__metadata-label">Sitio Web</span>
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-dialog__link"
                  aria-label="Visitar sitio web (se abre en una nueva pestaña)"
                >
                  <FiGlobe className="about-dialog__link-icon" aria-hidden />
                  <span>Visitar sitio</span>
                  <FiExternalLink className="about-dialog__external-icon" aria-hidden />
                </a>
              </div>
            )}
            {email && (
              <div className="about-dialog__metadata-item">
                <span className="about-dialog__metadata-label">Contacto</span>
                <a
                  href={`mailto:${email}`}
                  className="about-dialog__link"
                  aria-label={`Enviar correo a ${email}`}
                >
                  <FiMail className="about-dialog__link-icon" aria-hidden />
                  <span>{email}</span>
                </a>
              </div>
            )}
          </div>

          <div className="about-dialog__footer">
            <p>
              &copy; {currentYear} {author || 'LU9WT QSL Creator'}. Todos los derechos reservados.
            </p>
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
    displayName: PropTypes.string,
    version: PropTypes.string,
    author: PropTypes.string,
    homepage: PropTypes.string,
    description: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    license: PropTypes.string
  }).isRequired
}

export default AboutDialog
