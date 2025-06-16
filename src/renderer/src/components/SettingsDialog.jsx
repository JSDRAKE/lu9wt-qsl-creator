import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { FiX, FiSave, FiRotateCw } from 'react-icons/fi'
import '../styles/dialogs/settings-dialog.css'

const SettingsDialog = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'es',
    autoSave: true,
    autoUpdate: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')

  // Cerrar con la tecla ESC
  const handleKeyDown = useCallback((e) => e.key === 'Escape' && onClose(), [onClose])

  // Configurar eventos de teclado y scroll
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, handleKeyDown])

  // Cargar configuración al abrir el diálogo
  useEffect(() => {
    if (!isOpen) return

    const loadSettings = async () => {
      try {
        const loadedSettings = await window.electron.ipcRenderer.invoke('get-settings')
        setSettings((prev) => ({
          ...prev,
          ...loadedSettings
        }))
      } catch (error) {
        console.error('Error al cargar la configuración:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      await window.electron.ipcRenderer.invoke('save-settings', settings)
      onClose()
    } catch (error) {
      console.error('Error al guardar la configuración:', error)
    }
  }

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="settings-modal-overlay">
        <div className="settings-modal">
          <div className="settings-header">
            <h2>CONFIGURACIÓN</h2>
          </div>
          <div className="settings-loading">
            <FiRotateCw className="spinner-icon" />
            <p>Cargando configuración...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>CONFIGURACIÓN</h2>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
            aria-selected={activeTab === 'general'}
            aria-controls="general-tabpanel"
            id="general-tab"
            role="tab"
          >
            GENERAL
          </button>
          <button
            className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
            aria-selected={activeTab === 'advanced'}
            aria-controls="advanced-tabpanel"
            id="advanced-tab"
            role="tab"
          >
            AVANZADO
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-content">
            {activeTab === 'general' && (
              <div
                className="settings-section"
                id="general-tabpanel"
                role="tabpanel"
                aria-labelledby="general-tab"
              >
                <h3>APARIENCIA</h3>
                <div className="form-group">
                  <label htmlFor="theme">Tema</label>
                  <select
                    id="theme"
                    name="theme"
                    value={settings.theme}
                    onChange={handleInputChange}
                    aria-label="Seleccionar tema"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="language">Idioma</label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    aria-label="Seleccionar idioma"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="form-group">
                  <h3>PREFERENCIAS</h3>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="autoSave"
                      name="autoSave"
                      checked={settings.autoSave}
                      onChange={handleInputChange}
                      aria-label="Activar guardado automático"
                    />
                    <label htmlFor="autoSave">Guardado automático</label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div
                className="settings-section"
                id="advanced-tabpanel"
                role="tabpanel"
                aria-labelledby="advanced-tab"
              >
                <h3>ACTUALIZACIONES</h3>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="autoUpdate"
                      name="autoUpdate"
                      checked={settings.autoUpdate}
                      onChange={handleInputChange}
                      aria-label="Buscar actualizaciones automáticamente"
                    />
                    <label htmlFor="autoUpdate">Buscar actualizaciones automáticamente</label>
                  </div>
                  <p className="settings-note">
                    Reinicia la aplicación para aplicar los cambios en la configuración avanzada.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn btn-secondary" onClick={onClose} aria-label="Cancelar y cerrar">
            <FiX className="btn-icon" />
            <span>CANCELAR</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            aria-label="Guardar configuración"
          >
            <FiSave className="btn-icon" />
            <span>GUARDAR CAMBIOS</span>
          </button>
        </div>
      </div>
    </div>
  )
}

SettingsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SettingsDialog
