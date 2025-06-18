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
  // State declarations at the top
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newProfileName, setNewProfileName] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // Default settings (will be overridden by loaded settings)
    theme: 'light',
    language: 'es',
    notifications: true,
    profiles: [],
    activeProfileId: '',
    // User information
    userName: '',
    callsign: '',
    city: '',
    gridLocator: '',
    email: '',
    // External services
    qrzUsername: '',
    qrzPassword: '',
    hamqthUsername: '',
    hamqthPassword: '',
    // Application settings
    rememberMe: true,
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
        console.log('Settings response:', response) // Debug log

        if (response && response.success) {
          // If we have data in the response, use it, otherwise use defaults
          const loadedSettings = response.data?.data || {}
          console.log('Loaded settings:', loadedSettings) // Debug log

          // Merge with defaults to ensure all required fields are present
          const mergedSettings = {
            ...defaultSettings,
            ...loadedSettings,
            // Ensure profiles array exists and is an array
            profiles: Array.isArray(loadedSettings.profiles)
              ? loadedSettings.profiles
              : defaultSettings.profiles,
            // Ensure activeProfileId is valid
            activeProfileId: loadedSettings.activeProfileId || defaultSettings.activeProfileId
          }

          console.log('Merged settings:', mergedSettings) // Debug log
          setSettings(mergedSettings)
          // Set the initially selected profile to the active one
          setSelectedProfileId(mergedSettings.activeProfileId)
        } else {
          console.log('No valid settings found, using defaults')
          // Use default settings if no settings file exists or invalid response
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
      // Merge updates with existing settings
      const newSettings = {
        ...settings,
        ...updates,
        // Ensure profiles array is preserved if not being updated
        profiles: updates.profiles || settings.profiles
      }

      // If active profile is being updated, apply its settings to the root level
      if (updates.activeProfileId) {
        const activeProfile = newSettings.profiles.find(
          (profile) => profile.id === updates.activeProfileId
        )
        if (activeProfile) {
          // Apply profile-specific settings to root level
          // eslint-disable-next-line no-unused-vars
          const { id, name, ...profileSettings } = activeProfile
          // Asegurarse de que userName se copie correctamente
          if (activeProfile.userName !== undefined) {
            newSettings.userName = activeProfile.userName
          }
          Object.assign(newSettings, profileSettings)
        }
      }

      setSettings(newSettings)
      await saveSettings(newSettings)
    },
    [settings, saveSettings]
  )

  // Get current profile data (commented out for now as it's not currently used)
  // const getCurrentProfileData = useCallback(() => {
  //   if (!settings.activeProfileId) return {}
  //   return settings.profiles.find(
  //     (profile) => profile.id === settings.activeProfileId
  //   ) || {}
  // }, [settings.activeProfileId, settings.profiles])

  // Handle input changes for both direct field updates and form elements
  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target
      const fieldValue = type === 'checkbox' ? checked : value

      // Definir campos específicos del perfil
      const profileFields = [
        'userName',
        'callsign',
        'city',
        'gridLocator',
        'email',
        'qrzUsername',
        'qrzPassword',
        'hamqthUsername',
        'hamqthPassword'
      ]

      // Si hay un perfil activo y el campo pertenece a los datos del perfil
      if (settings.activeProfileId && profileFields.includes(name)) {
        // Actualizar los datos del perfil
        const updatedProfiles = settings.profiles.map((profile) =>
          profile.id === settings.activeProfileId ? { ...profile, [name]: fieldValue } : profile
        )

        // Actualizar tanto el perfil como la configuración raíz
        updateSettings({
          profiles: updatedProfiles,
          [name]: fieldValue
        })
      } else {
        // Para campos que no son del perfil o cuando no hay perfil activo
        updateSettings({ [name]: fieldValue })
      }
    },
    [settings.activeProfileId, settings.profiles, updateSettings]
  )

  // Handle profile selection change (only updates the selection, not the active profile)
  const handleProfileSelect = useCallback((e) => {
    setSelectedProfileId(e.target.value)
  }, [])

  // Handle profile activation
  const handleActivateProfile = useCallback(() => {
    if (!selectedProfileId) return

    // Encontrar el perfil seleccionado
    const selectedProfile = settings.profiles.find((profile) => profile.id === selectedProfileId)
    if (!selectedProfile) return

    // Extraer los datos del perfil con valores por defecto
    // eslint-disable-next-line no-unused-vars
    const { id, name: profileName, ...profileData } = selectedProfile || {}

    // Extraer los campos que necesitamos
    const {
      userName = '',
      callsign = '',
      city = '',
      gridLocator = '',
      email = '',
      qrzUsername = '',
      qrzPassword = '',
      hamqthUsername = '',
      hamqthPassword = ''
    } = profileData

    // Actualizar la configuración con los datos del perfil
    updateSettings({
      activeProfileId: selectedProfileId,
      userName,
      callsign,
      city,
      gridLocator,
      email,
      qrzUsername,
      qrzPassword,
      hamqthUsername,
      hamqthPassword
    })
  }, [selectedProfileId, settings.profiles, updateSettings])

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
      name: newProfileName.trim(), // Nombre del perfil
      // Inicializar campos vacíos para el nuevo perfil
      userName: '',
      callsign: '',
      city: '',
      gridLocator: '',
      email: '',
      qrzUsername: '',
      qrzPassword: '',
      hamqthUsername: '',
      hamqthPassword: ''
    }

    const updatedProfiles = [...settings.profiles, newProfile]
    updateSettings({
      profiles: updatedProfiles,
      activeProfileId: newProfile.id,
      // No copiamos el nombre del perfil al estado raíz, solo los datos del usuario
      userName: settings.userName || '',
      callsign: settings.callsign || '',
      city: settings.city || '',
      gridLocator: settings.gridLocator || '',
      email: settings.email || '',
      qrzUsername: settings.qrzUsername || '',
      qrzPassword: settings.qrzPassword || '',
      hamqthUsername: settings.hamqthUsername || '',
      hamqthPassword: settings.hamqthPassword || ''
    })
    setSelectedProfileId(newProfile.id)
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
                    value={selectedProfileId || ''}
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
                      onClick={handleActivateProfile}
                      title="Activar perfil"
                      disabled={
                        isCreatingProfile ||
                        !selectedProfileId ||
                        selectedProfileId === settings.activeProfileId
                      }
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
              <label htmlFor="userName">Nombre de Usuario</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={settings.userName || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Tu nombre de usuario"
              />
            </div>
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
