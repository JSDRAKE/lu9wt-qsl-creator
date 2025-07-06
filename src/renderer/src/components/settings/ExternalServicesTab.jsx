import PropTypes from 'prop-types'
import { useCallback } from 'react'
import '../../styles/components/tabs/external-services-tab.css'

const ExternalServicesTab = ({ settings, onSettingsChange }) => {
  // Handle input changes for external services
  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target
      const fieldValue = type === 'checkbox' ? checked : value

      // Update settings through the parent
      onSettingsChange({ [name]: fieldValue })
    },
    [onSettingsChange]
  )

  // Handle password field changes (can be extended with validation)
  const handlePasswordChange = useCallback(
    (e) => {
      handleInputChange(e)
    },
    [handleInputChange]
  )

  return (
    <div className="tab-content external-services-tab" id="external-tabpanel">
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
            onChange={handlePasswordChange}
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
            onChange={handlePasswordChange}
            className="form-input"
            placeholder="Contraseña de HamQTH.com"
          />
        </div>
      </div>
    </div>
  )
}

ExternalServicesTab.propTypes = {
  settings: PropTypes.shape({
    qrzUsername: PropTypes.string,
    qrzPassword: PropTypes.string,
    hamqthUsername: PropTypes.string,
    hamqthPassword: PropTypes.string
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired
}

export default ExternalServicesTab
