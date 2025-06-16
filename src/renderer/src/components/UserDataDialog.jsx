import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import '../styles/dialogs/user-data-dialog.css'

const UserDataDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    callsign: '',
    name: '',
    city: '',
    gridLocator: '',
    email: ''
  })
  const [showFirstTimeMessage, setShowFirstTimeMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      // Set loading to false immediately with empty form
      setIsLoading(false)
      setFormData({
        callsign: '',
        name: '',
        city: '',
        gridLocator: '',
        email: ''
      })
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { success, error } = await window.electron.ipcRenderer.invoke(
        'save-user-data',
        formData
      )
      if (success) {
        console.log('User data saved successfully')
        onClose()
      } else {
        console.error('Failed to save user data:', error)
      }
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  // Load user data when dialog opens
  useEffect(() => {
    if (!isOpen) return

    const loadUserData = async () => {
      try {
        const { success, data, error } = await window.electron.ipcRenderer.invoke('get-user-data')
        if (success) {
          // Check if this is the first time (all fields are empty)
          const isFirstTime = !data || Object.values(data).every((value) => !value)
          setShowFirstTimeMessage(isFirstTime)

          if (data) {
            setFormData(data)
          }
        } else {
          console.error('Failed to load user data:', error)
          setShowFirstTimeMessage(true) // Show message if there was an error loading data
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setShowFirstTimeMessage(true) // Show message if there was an error
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [isOpen])

  // Close with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="user-data-modal-overlay">
        <div className="user-data-modal">
          <div className="loading-spinner">Loading user data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-data-modal-overlay">
      <div className="user-data-modal">
        <div className="modal-header">
          <h2>User Data</h2>
          <button className="btn close-button" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        {showFirstTimeMessage && (
          <div className="first-time-message">
            <p>⚠️ Por favor, complete sus datos personales para continuar.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="user-data-form">
          <div className="form-group">
            <label htmlFor="callsign">Señal Distintiva</label>
            <input
              type="text"
              id="callsign"
              name="callsign"
              value={formData.callsign}
              onChange={handleInputChange}
              required
              placeholder="e.g., LU9WT"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder="Your city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gridLocator">Grid Locator</label>
            <input
              type="text"
              id="gridLocator"
              name="gridLocator"
              value={formData.gridLocator}
              onChange={handleInputChange}
              required
              placeholder="e.g., GF05"
              maxLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">eMail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

UserDataDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default UserDataDialog
