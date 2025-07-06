import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiSave, FiTrash2, FiUserCheck, FiUserPlus, FiX } from 'react-icons/fi'
import '../../styles/components/tabs/profile-tab.css'

const ProfileTab = ({
  profiles = [],
  activeProfileId,
  selectedProfileId,
  onProfileChange,
  onSettingsChange,
  onSelectProfile
}) => {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  // Set initial selected profile when activeProfileId changes
  useEffect(() => {
    if (activeProfileId) {
      onSelectProfile(activeProfileId)
    }
  }, [activeProfileId, onSelectProfile])

  // Handle profile selection change (only updates the selection, not the active profile)
  const handleProfileSelect = useCallback(
    (e) => {
      onSelectProfile(e.target.value)
    },
    [onSelectProfile]
  )

  // Handle profile activation
  const handleActivateProfile = useCallback(() => {
    if (!selectedProfileId) return

    // Find the selected profile
    const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId)
    if (!selectedProfile) return

    // Extract profile data with default values
    // eslint-disable-next-line no-unused-vars
    const { id, name: profileName, ...profileData } = selectedProfile || {}

    // Extract the fields we need
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

    // Update the settings with the profile data
    onSettingsChange({
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
  }, [selectedProfileId, profiles, onSettingsChange])

  const handleNewProfile = useCallback(() => {
    setIsCreatingProfile(true)
    setNewProfileName(`Perfil ${profiles.length + 1}`)

    // Clear all user and external service data
    onProfileChange({
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
    })
  }, [onProfileChange, profiles.length])

  const handleSaveNewProfile = useCallback(() => {
    if (!newProfileName.trim()) return

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      // Initialize empty fields for the new profile
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

    const updatedProfiles = [...profiles, newProfile]
    onProfileChange({
      profiles: updatedProfiles,
      activeProfileId: newProfile.id,
      // Copy current settings to root level
      userName: '',
      callsign: '',
      city: '',
      gridLocator: '',
      email: '',
      qrzUsername: '',
      qrzPassword: '',
      hamqthUsername: '',
      hamqthPassword: ''
    })

    onSelectProfile(newProfile.id)
    setIsCreatingProfile(false)
    setNewProfileName('')
  }, [newProfileName, onProfileChange, onSelectProfile, profiles])

  const handleCancelNewProfile = useCallback(() => {
    setIsCreatingProfile(false)
    setNewProfileName('')
  }, [])

  const handleDeleteProfile = useCallback(() => {
    if (profiles.length <= 1) {
      alert('No se puede eliminar el último perfil')
      return
    }

    const updatedProfiles = profiles.filter((p) => p.id !== activeProfileId)
    const newActiveProfileId = updatedProfiles[0]?.id || ''

    onProfileChange({
      profiles: updatedProfiles,
      activeProfileId: newActiveProfileId
    })

    onSelectProfile(newActiveProfileId)
  }, [activeProfileId, onProfileChange, onSelectProfile, profiles])

  const handleEditProfile = useCallback(() => {
    const currentProfile = profiles.find((p) => p.id === activeProfileId)
    if (!currentProfile) return

    const newName = prompt('Nuevo nombre para el perfil:', currentProfile.name)
    if (!newName || newName === currentProfile.name) return

    const updatedProfiles = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, name: newName } : p
    )

    onProfileChange({
      profiles: updatedProfiles
    })
  }, [activeProfileId, onProfileChange, profiles])
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSaveNewProfile()
      } else if (e.key === 'Escape') {
        handleCancelNewProfile()
      }
    },
    [handleSaveNewProfile, handleCancelNewProfile]
  )

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
              disabled={isCreatingProfile}
            >
              {profiles.map((profile) => (
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
                  isCreatingProfile || !selectedProfileId || selectedProfileId === activeProfileId
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
                disabled={profiles.length <= 1 || isCreatingProfile}
                title="Eliminar perfil"
              >
                <FiTrash2 />
                <span>Borrar</span>
              </button>
            </div>
          </div>
        </div>
        {isCreatingProfile && (
          <div className="new-profile-input" style={{ marginTop: '1rem' }}>
            <input
              type="text"
              className="form-control input-sm"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nombre del perfil"
              autoFocus
              style={{ width: '100%', marginBottom: '0.5rem' }}
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
  )
}

ProfileTab.propTypes = {
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      userName: PropTypes.string,
      callsign: PropTypes.string,
      city: PropTypes.string,
      gridLocator: PropTypes.string,
      email: PropTypes.string,
      qrzUsername: PropTypes.string,
      qrzPassword: PropTypes.string,
      hamqthUsername: PropTypes.string,
      hamqthPassword: PropTypes.string
    })
  ),
  activeProfileId: PropTypes.string,
  selectedProfileId: PropTypes.string,
  onProfileChange: PropTypes.func.isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  onSelectProfile: PropTypes.func.isRequired
}

export default ProfileTab
