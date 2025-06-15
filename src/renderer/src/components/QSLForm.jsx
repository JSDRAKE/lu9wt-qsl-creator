import PropTypes from 'prop-types'
import { useState } from 'react'

const QSLForm = ({ onGenerate, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    callsign: initialValues.callsign || '',
    date: initialValues.date || '',
    time: initialValues.time || '',
    frequency: initialValues.frequency || '',
    report: initialValues.report || '',
    mode: initialValues.mode || '',
    qslTemplate: initialValues.qslTemplate || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(formData)
  }

  const handleReset = () => {
    setFormData({
      callsign: '',
      date: '',
      time: '',
      frequency: '',
      report: '',
      mode: '',
      qslTemplate: ''
    })
  }

  return (
    <div className="form-container">
      <h2>Data Entry</h2>
      <form onSubmit={handleSubmit} id="qsl-form">
        <label>
          Correspondent
          <input
            type="text"
            name="callsign"
            value={formData.callsign}
            onChange={handleInputChange}
            placeholder="Callsign"
            required
          />
        </label>

        <label>
          Date (DD/MM/YYYY)
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="DD/MM/YYYY"
            maxLength="10"
            title="Valid format: DD/MM/YYYY"
            required
          />
        </label>

        <label>
          Time (HH:MM)
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="HH:MM"
            maxLength="5"
            title="Valid format: HH:MM"
            required
          />
        </label>

        <label>
          Frequency (kHz or MHz)
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
            placeholder="Frequency"
            required
          />
        </label>

        <label>
          RST
          <input
            type="text"
            name="report"
            value={formData.report}
            onChange={handleInputChange}
            placeholder="RST"
            required
          />
        </label>

        <label>
          Mode
          <input
            type="text"
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            placeholder="Mode"
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Generate QSL
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

QSLForm.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    callsign: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    frequency: PropTypes.string,
    report: PropTypes.string,
    mode: PropTypes.string,
    qslTemplate: PropTypes.string
  })
}

export default QSLForm
