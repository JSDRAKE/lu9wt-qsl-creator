import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
// IPC is now handled through the preload script
import {
  FiEdit,
  FiGlobe,
  FiRotateCw,
  FiSave,
  FiSettings,
  FiTrash2,
  FiUser,
  FiUserCheck,
  FiUserPlus,
  FiX
} from 'react-icons/fi'
import '../styles/dialogs/settings-dialog.css'

const SettingsDialog = ({ isOpen, onClose }) => {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newProfileName, setNewProfileName] = useState('')
  const [settings, setSettings] = useState({
    // Default settings (will be overridden by loaded settings)
    theme: 'light',
    language: 'es',
    notifications: true,
    profiles: [],
    activeProfileId: '',
    email: '',
    password: '',
    rememberMe: true,
    externalApiKey: '',
    autoSync: false,
    syncInterval: 60
  })

  // Default settings
  const defaultSettings = useMemo(
    () => ({
      theme: 'light',
      language: 'es',
      notifications: true,
      profiles: [],
      activeProfileId: '',
      email: '',
      password: '',
      rememberMe: true,
      externalApiKey: '',
      autoSync: false,
      syncInterval: 60
    }),
    []
  )

  // Load settings when component mounts or when isOpen changes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await window.api.getSettings()
        if (response && response.success && response.data) {
          // Merge with defaults to ensure all required fields are present
          setSettings({ ...defaultSettings, ...response.data })
        } else {
          // Use default settings if no settings file exists
          setSettings(defaultSettings)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        // Use default settings if there's an error
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadSettings()
    }
  }, [isOpen, defaultSettings])

  // Save settings whenever they change
  const saveSettings = useCallback(async (newSettings) => {
    try {
      const response = await window.api.saveSettings(newSettings)
      if (!response.success) {
        console.error('Error saving settings:', response.error)
        return false
      }
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  }, [])

  // Update settings and save to file
  const updateSettings = useCallback(
    async (updates) => {
      const newSettings = { ...settings, ...updates }
      setSettings(newSettings)
      await saveSettings(newSettings)
    },
    [settings, saveSettings]
  )

  // Handle input changes for both direct field updates and form elements
  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e?.target || {}

      // If called directly with field and value (e.g., from a custom component)
      if (typeof e === 'string' && value === undefined) {
        updateSettings({ [e]: value })
        return
      }

      // Handle regular form inputs
      if (name) {
        updateSettings({ [name]: type === 'checkbox' ? checked : value })
      }
    },
    [updateSettings]
  )

  // Handle profile selection change
  const handleProfileSelect = useCallback(
    (e) => {
      updateSettings({ activeProfileId: e.target.value })
    },
    [updateSettings]
  )

  const [activeTab, setActiveTab] = useState('general')

  const handleNewProfile = () => {
    setIsCreatingProfile(true)
    setNewProfileName(`Perfil ${settings.profiles.length + 1}`)

    // Clear all user and external service data
    setSettings((prev) => ({
      ...prev,
      // User data
      callsign: '',
      name: '',
      city: '',
      gridLocator: '',
      email: '',

      // External services
      externalApiKey: '',
      qrzUsername: '',
      qrzPassword: '',
      hamqthUsername: '',
      hamqthPassword: '',

      // Sync settings
      autoSync: false,
      syncInterval: 60
    }))
  }

  const handleSaveNewProfile = () => {
    if (!newProfileName.trim()) return

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      callsign: '',
      fullName: '',
      qth: '',
      country: ''
    }

    setSettings((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id
    }))

    setIsCreatingProfile(false)
    setNewProfileName('')
  }

  const handleCancelNewProfile = () => {
    setIsCreatingProfile(false)
    setNewProfileName('')
  }

  const handleDeleteProfile = () => {
    if (settings.profiles.length <= 1) {
      alert('No se puede eliminar el último perfil')
      return
    }
    setSettings((prev) => ({
      ...prev,
      profiles: prev.profiles.filter((p) => p.id !== prev.activeProfileId),
      activeProfileId: prev.profiles[0].id
    }))
  }

  const handleEditProfile = () => {
    const currentProfile = settings.profiles.find((p) => p.id === settings.activeProfileId)
    if (!currentProfile) return
    const newName = prompt('Nuevo nombre para el perfil:', currentProfile.name)
    if (!newName || newName === currentProfile.name) return
    setSettings((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? { ...p, name: newName } : p
      )
    }))
  }

  const handleKeyDown = useCallback((e) => e.key === 'Escape' && onClose(), [onClose])

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, handleKeyDown])

  // Handle form submission
  const handleSave = useCallback(async () => {
    try {
      await saveSettings(settings)
      onClose()
    } catch (error) {
      console.error('Error al guardar la configuración:', error)
    }
  }, [settings, saveSettings, onClose])

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content" id="general-tabpanel">
            <div className="form-group">
              <label htmlFor="theme">Tema</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleInputChange}
                className="form-select"
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
                className="form-select"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="tab-content profile-tab" id="profile-tabpanel">
            <div className="form-group">
              <label htmlFor="profile-selector">Seleccionar Perfil</label>
              <div className="profile-selector">
                <div className="profile-selector-container">
                  <select
                    id="profile-selector"
                    value={settings.activeProfileId}
                    onChange={handleProfileSelect}
                    className="form-select"
                  >
                    {settings.profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="profile-actions">
                  <div className="profile-actions-row">
                    <button
                      type="button"
                      className="btn btn-small btn-primary btn-icon"
                      onClick={() => {}}
                      title="Activar perfil"
                      disabled={isCreatingProfile}
                    >
                      <FiUserCheck />
                      <span>Activar</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-success btn-icon"
                      onClick={handleNewProfile}
                      title="Nuevo perfil"
                      disabled={isCreatingProfile}
                    >
                      <FiUserPlus />
                      <span>Nuevo</span>
                    </button>
                  </div>
                  <div className="profile-actions-row">
                    <button
                      type="button"
                      className="btn btn-small btn-icon"
                      onClick={handleEditProfile}
                      title="Editar nombre del perfil"
                      disabled={isCreatingProfile}
                    >
                      <FiEdit />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-danger btn-icon"
                      onClick={handleDeleteProfile}
                      disabled={settings.profiles.length <= 1 || isCreatingProfile}
                      title="Eliminar perfil"
                    >
                      <FiTrash2 />
                      <span>Borrar</span>
                    </button>
                  </div>
                </div>
                {isCreatingProfile && (
                  <div className="new-profile-input" style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      className="form-control input-sm"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="Nombre del perfil"
                      autoFocus
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveNewProfile()}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-small btn-success btn-icon"
                        onClick={handleSaveNewProfile}
                        title="Guardar perfil"
                        disabled={!newProfileName.trim()}
                      >
                        <FiSave />
                        <span>Guardar</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-icon"
                        onClick={handleCancelNewProfile}
                        title="Cancelar"
                      >
                        <FiX />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'user':
        return (
          <div className="tab-content" id="user-tabpanel">
            <div className="form-group">
              <label htmlFor="callsign">Indicativo</label>
              <input
                type="text"
                id="callsign"
                name="callsign"
                value={settings.callsign || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: LU9WT"
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={settings.name || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nombre completo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">Ciudad</label>
              <input
                type="text"
                id="city"
                name="city"
                value={settings.city || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Buenos Aires"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gridLocator">Grid Locator</label>
              <input
                type="text"
                id="gridLocator"
                name="gridLocator"
                value={settings.gridLocator || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: GF05tj"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="tu@email.com"
              />
            </div>
          </div>
        )

      case 'external':
        return (
          <div className="tab-content" id="external-tabpanel">
            <div className="service-credentials">
              <h4>QRZ.com</h4>
              <div className="form-group">
                <label htmlFor="qrzUsername">Usuario</label>
                <input
                  type="text"
                  id="qrzUsername"
                  name="qrzUsername"
                  value={settings.qrzUsername || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Usuario de QRZ.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="qrzPassword">Contraseña</label>
                <input
                  type="password"
                  id="qrzPassword"
                  name="qrzPassword"
                  value={settings.qrzPassword || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Contraseña de QRZ.com"
                />
              </div>
            </div>

            <div className="service-credentials" style={{ marginTop: '1.5rem' }}>
              <h4>HamQTH.com</h4>
              <div className="form-group">
                <label htmlFor="hamqthUsername">Usuario</label>
                <input
                  type="text"
                  id="hamqthUsername"
                  name="hamqthUsername"
                  value={settings.hamqthUsername || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Usuario de HamQTH.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hamqthPassword">Contraseña</label>
                <input
                  type="password"
                  id="hamqthPassword"
                  name="hamqthPassword"
                  value={settings.hamqthPassword || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Contraseña de HamQTH.com"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>CONFIGURACIÓN</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
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
            <FiSettings className="tab-icon" />
            <span>General</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            aria-selected={activeTab === 'profile'}
            aria-controls="profile-tabpanel"
            id="profile-tab"
            role="tab"
          >
            <FiUser className="tab-icon" />
            <span>Perfil</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
            aria-selected={activeTab === 'user'}
            aria-controls="user-tabpanel"
            id="user-tab"
            role="tab"
          >
            <FiUserCheck className="tab-icon" />
            <span>Usuario</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'external' ? 'active' : ''}`}
            onClick={() => setActiveTab('external')}
            aria-selected={activeTab === 'external'}
            aria-controls="external-tabpanel"
            id="external-tab"
            role="tab"
          >
            <FiGlobe className="tab-icon" />
            <span>Servicio Externo</span>
          </button>
        </div>

        <div className="settings-content">{renderTabContent()}</div>

        <div className="settings-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cancelar y cerrar"
          >
            <FiX className="btn-icon" />
            <span>CANCELAR</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isLoading}
            aria-label="Guardar configuración"
          >
            {isLoading ? <FiRotateCw className="btn-icon spin" /> : <FiSave className="btn-icon" />}
            <span>{isLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}</span>
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
