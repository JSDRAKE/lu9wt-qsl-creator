const QSLForm = ({ formData, onInputChange, onGenerate, onReset }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate()
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="Mode"
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Generate QSL
          </button>
          <button type="button" className="btn btn-secondary" onClick={onReset}>
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default QSLForm
