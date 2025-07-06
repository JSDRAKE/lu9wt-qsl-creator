import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiRotateCw, FiSave, FiX } from 'react-icons/fi'
import SettingsTabs from './settings/SettingsTabs'
import '../styles/dialogs/settings-dialog.css'

const SettingsDialog = ({ isOpen, onClose }) => {
  // State declarations at the top
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // Default settings (will be overridden by loaded settings)
    notifications: true,
    profiles: [],
    activeProfileId: '',
    // User information
    userName: '',
    callsign: '',
    city: '',
    gridLocator: '',
    email: '',
    // Email authentication
    emailVerified: false,
    // External services (managed by ExternalServicesTab)
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
      notifications: true,
      profiles: [],
      activeProfileId: '',
      email: '',
      emailPassword: '',
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

  // Profile data is now managed by the ProfileTab component

  // Handle general settings changes from GeneralTab
  const handleGeneralSettingsChange = useCallback(
    (generalSettings) => {
      updateSettings(generalSettings)
    },
    [updateSettings]
  )

  // Handle profile changes
  const handleProfileChange = useCallback((updates) => {
    setSettings((prev) => ({
      ...prev,
      ...updates
    }))
    // Update selected profile ID if it's being changed
    if (updates.activeProfileId) {
      setSelectedProfileId(updates.activeProfileId)
    }
  }, [])

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

  const tabContentProps = {
    settings,
    activeProfileId: settings.activeProfileId,
    selectedProfileId,
    onProfileChange: handleProfileChange,
    onSettingsChange: updateSettings,
    onSelectProfile: setSelectedProfileId,
    onGeneralSettingsChange: handleGeneralSettingsChange
  }

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>CONFIGURACIÓN</h2>
        </div>

        <SettingsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabContentProps={tabContentProps}
        />

        <div className="settings-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cancelar y cerrar"
          >
            <FiX size={16} />
            <span>CANCELAR</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isLoading}
            aria-label="Guardar configuración"
          >
            {isLoading ? <FiRotateCw className="spin" size={16} /> : <FiSave size={16} />}
            <span>{isLoading ? 'GUARDANDO...' : 'GUARDAR'}</span>
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
