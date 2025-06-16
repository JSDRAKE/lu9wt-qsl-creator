import PropTypes from 'prop-types'
import { useState } from 'react'
import '../styles/components/QSLForm.css'
import '../styles/components/buttons.css'

const QSLForm = ({ onGenerate, onInputChange, formData, onReset }) => {
  const [errors, setErrors] = useState({
    callsign: '',
    date: '',
    time: '',
    frequency: '',
    report: '',
    mode: ''
  })

  const validateCallsign = (value) => {
    const regex = /^[A-Z0-9/]*$/
    return regex.test(value) && value.length <= 15
  }

  const isValidDate = (day, month, year) => {
    if (year < 1900 || year > 2100) return false
    if (month < 1 || month > 12) return false
    const daysInMonth = new Date(year, month, 0).getDate()
    return day > 0 && day <= daysInMonth
  }

  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }

  const validateDate = (value) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!dateRegex.test(value)) return false
    const [, day, month, year] = value.match(dateRegex).map(Number)
    return isValidDate(day, month, year)
  }

  const formatTimeInput = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`
  }

  const validateTime = (value) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(value)
  }

  const formatFrequency = (value) => {
    if (!value) return ''

    // Remove all non-digit characters except decimal point
    let numbers = value.replace(/[^0-9.]/g, '')

    // Only keep the first decimal point if there are multiple
    const decimalIndex = numbers.indexOf('.')
    if (decimalIndex !== -1) {
      numbers =
        numbers.substring(0, decimalIndex + 1) + numbers.substring(decimalIndex).replace(/\./g, '')
    }

    // Limit to 2 decimal places
    if (decimalIndex !== -1) {
      const [whole, decimal] = numbers.split('.')
      if (decimal && decimal.length > 2) {
        numbers = `${whole}.${decimal.substring(0, 2)}`
      }
    }

    // Add thousands separators
    if (numbers) {
      const parts = numbers.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    }

    return numbers
  }

  const validateFrequency = (value) => {
    if (!value) return false
    const freqRegex = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/
    if (!freqRegex.test(value)) return false
    const numValue = parseFloat(value.replace(/,/g, ''))
    if (Number.isNaN(numValue)) return false
    return numValue >= 1.0 && numValue <= 900000.0
  }

  const validateRST = (value) => {
    if (!value) return false
    if (/^[+-]/.test(value)) {
      return /^[+-]\d{2}$/.test(value) && value.length === 3
    }
    return /^\d{2,3}$/.test(value) && value.length >= 2 && value.length <= 3
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    if (name === 'callsign') {
      const formattedValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '')
      if (validateCallsign(formattedValue) || formattedValue === '') {
        onInputChange({
          target: { name, value: formattedValue }
        })
      }
      return
    }

    if (name === 'date') {
      const formattedValue = formatDateInput(value)
      onInputChange({
        target: { name, value: formattedValue }
      })
      return
    }

    if (name === 'time') {
      const formattedValue = formatTimeInput(value)
      if (formattedValue.length <= 5) {
        onInputChange({
          target: { name, value: formattedValue }
        })
      }
      return
    }

    if (name === 'report') {
      if (/^[+-]?\d*$/.test(value)) {
        const maxLength = value.startsWith('+') || value.startsWith('-') ? 3 : 3
        if (value.length <= maxLength) {
          onInputChange({
            target: { name, value }
          })
        }
      }
      return
    }

    if (name === 'frequency') {
      const formattedValue = formatFrequency(value)
      onInputChange({
        target: { name, value: formattedValue }
      })
      return
    }

    onInputChange(e)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    let hasErrors = false

    if (!validateCallsign(formData.callsign)) {
      newErrors.callsign =
        'Ingrese un indicativo válido (máx 15 caracteres, solo letras mayúsculas, números y /)'
      hasErrors = true
    }

    if (formData.date && !validateDate(formData.date)) {
      newErrors.date = 'Ingrese una fecha válida en formato DD/MM/AAAA (ej: 15/06/2025)'
      hasErrors = true
    }

    if (formData.time && !validateTime(formData.time)) {
      newErrors.time = 'Ingrese una hora válida en formato HH:MM (ej: 14:30)'
      hasErrors = true
    }

    if (!validateFrequency(formData.frequency)) {
      newErrors.frequency = 'Ingrese una frecuencia válida en formato 1,234.56 (de 1.00 a 1000.00)'
      hasErrors = true
    }

    if (!validateRST(formData.report)) {
      newErrors.report = 'Formato inválido. Use: 59, 599, +05 o -10'
      hasErrors = true
    }

    // Set the errors first
    setErrors({
      ...newErrors,
      ...(hasErrors ? {} : { qslTemplate: '' }) // Clear template error if no other errors
    })

    // Only proceed with generation if there are no errors
    if (!hasErrors) {
      const success = onGenerate(formData)
      if (!success) {
        // If generation failed (no template selected), show the error
        setErrors((prev) => ({
          ...prev,
          qslTemplate: 'Por favor seleccione una plantilla QSL antes de generar'
        }))
      }
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      // Fallback en caso de que onReset no esté definido
      onInputChange({ target: { name: 'callsign', value: '' } })
      onInputChange({ target: { name: 'date', value: '' } })
      onInputChange({ target: { name: 'time', value: '' } })
      onInputChange({ target: { name: 'frequency', value: '' } })
      onInputChange({ target: { name: 'report', value: '' } })
      onInputChange({ target: { name: 'mode', value: '' } })
    }
  }

  return (
    <div className="form-container">
      <h2>Datos del Contacto</h2>
      <form onSubmit={handleSubmit} id="qsl-form">
        <div className={`form-group ${errors.callsign ? 'has-error' : ''}`}>
          <label>
            Corresponsal
            <input
              type="text"
              name="callsign"
              value={formData.callsign}
              onChange={handleInputChange}
              placeholder="Ej: LU0ABC"
              title="Máximo 15 caracteres. Solo letras mayúsculas, números y /"
              className={errors.callsign ? 'error' : ''}
              maxLength="15"
              onInput={(e) => {
                // Only allow uppercase letters, numbers and forward slash
                e.target.value = e.target.value.replace(/[^A-Z0-9/]/gi, '').toUpperCase()
              }}
              required
            />
          </label>
          {errors.callsign && <div className="error-message">{errors.callsign}</div>}
        </div>

        <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
          <label>
            Fecha (DD/MM/AAAA)
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              maxLength="10"
              title="Formato: DD/MM/AAAA (ej: 15/06/2025)"
              pattern="^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$"
              className={errors.date ? 'error' : ''}
              required
            />
          </label>
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>

        <div className={`form-group ${errors.time ? 'has-error' : ''}`}>
          <label>
            Hora (HH:MM)
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="HH:MM (ej: 14:30)"
              maxLength="5"
              pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
              title="Formato: HH:MM (ej: 14:30)"
              className={errors.time ? 'error' : ''}
              required
            />
          </label>
          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>

        <div className={`form-group ${errors.frequency ? 'has-error' : ''}`}>
          <label>
            Frecuencia (MHz)
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              placeholder="Ej: 14,250.50"
              title="Formato: 1,234.56 (de 1.00 a 1000.00)"
              inputMode="decimal"
              className={errors.frequency ? 'error' : ''}
              required
            />
          </label>
          {errors.frequency && <div className="error-message">{errors.frequency}</div>}
        </div>

        <div className={`form-group ${errors.report ? 'has-error' : ''}`}>
          <label>
            RST
            <input
              type="text"
              name="report"
              value={formData.report}
              onChange={handleInputChange}
              placeholder="Ej: 59, 599, +05, -10"
              title="Formatos válidos: 59, 599, +05, -10"
              inputMode="numeric"
              maxLength={3}
              className={errors.report ? 'error' : ''}
              required
            />
          </label>
          {errors.report && <div className="error-message">{errors.report}</div>}
        </div>

        <div className={`form-group ${errors.mode ? 'has-error' : ''}`}>
          <label htmlFor="mode">Modo</label>
          <select
            id="mode"
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && formData.mode) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            className={errors.mode ? 'error' : ''}
            required
          >
            <option value="">Seleccione un modo</option>
            <option value="SSB">SSB (Banda Lateral Única)</option>
            <option value="USB">USB (Banda Lateral Superior)</option>
            <option value="LSB">LSB (Banda Lateral Inferior)</option>
            <option value="CW">CW (Telegrafía)</option>
            <option value="FT8">FT8</option>
            <option value="FT4">FT4</option>
            <option value="PSK31">PSK31</option>
            <option value="RTTY">RTTY</option>
            <option value="SSTV">SSTV</option>
            <option value="AM">AM (Amplitud Modulada)</option>
            <option value="FM">FM (Frecuencia Modulada)</option>
            <option value="DIGITAL">Digital</option>
            <option value="OTHER">Otro</option>
          </select>
          {errors.mode && <div className="error-message">{errors.mode}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Generar QSL
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}

QSLForm.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  formData: PropTypes.shape({
    callsign: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    frequency: PropTypes.string,
    report: PropTypes.string,
    mode: PropTypes.string,
    qslTemplate: PropTypes.string
  }).isRequired
}

export default QSLForm
