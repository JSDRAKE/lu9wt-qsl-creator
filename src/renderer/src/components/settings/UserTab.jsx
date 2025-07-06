import PropTypes from 'prop-types'
import { useCallback } from 'react'
import '../../styles/components/tabs/user-tab.css'

const UserTab = ({ userData, onSettingsChange }) => {
  // Handle input changes for user data
  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target
      const fieldValue = type === 'checkbox' ? checked : value

      // Update settings through the parent
      onSettingsChange({ [name]: fieldValue })
    },
    [onSettingsChange]
  )

  return (
    <div className="tab-content user-tab" id="user-tabpanel">
      <div className="form-group">
        <label htmlFor="userName">Nombre de Usuario</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={userData.userName || ''}
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
          value={userData.callsign || ''}
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
          value={userData.city || ''}
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
          value={userData.gridLocator || ''}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Ej: GF05tj"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email || ''}
          onChange={handleInputChange}
          className="form-input"
          placeholder="tu@email.com"
        />
      </div>
    </div>
  )
}

UserTab.propTypes = {
  userData: PropTypes.shape({
    userName: PropTypes.string,
    callsign: PropTypes.string,
    city: PropTypes.string,
    gridLocator: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired
}

export default UserTab
