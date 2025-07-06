import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import '../../styles/components/tabs/general-tab.css'

const GeneralTab = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    language: 'es'
  })

  // Sync with parent settings
  useEffect(() => {
    setLocalSettings({
      theme: settings.theme || 'light',
      language: settings.language || 'es'
    })
  }, [settings.theme, settings.language])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...localSettings, [name]: value }
    setLocalSettings(updated)
    onSettingsChange(updated)
  }
  return (
    <div className="tab-content general-tab" id="general-tabpanel">
      <div className="form-group">
        <label htmlFor="theme">Tema</label>
        <select
          id="theme"
          name="theme"
          value={localSettings.theme}
          onChange={handleChange}
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
          value={localSettings.language}
          onChange={handleChange}
          className="form-select"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  )
}

GeneralTab.propTypes = {
  settings: PropTypes.shape({
    theme: PropTypes.string,
    language: PropTypes.string
  }),
  onSettingsChange: PropTypes.func.isRequired
}

export default GeneralTab
