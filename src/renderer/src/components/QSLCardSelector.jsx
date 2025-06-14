const QSL_TEMPLATES = [
  { value: 'assets/LU2WA.jpg', label: 'LU2WA' },
  { value: 'assets/Sarmiento-2022.jpg', label: 'Sarmiento 2022' },
  { value: 'assets/Malvinas-2022.jpg', label: 'Malvinas 2022' },
  { value: 'assets/Faro-Novales-2023.jpg', label: 'Faro Novales 2023' },
  { value: 'assets/Malvinas-2023.jpg', label: 'Malvinas 2023' },
  { value: 'assets/Cabo-Blanco-2020.jpg', label: 'Cabo Blanco 2020' },
  { value: 'assets/Cabo-Blanco-2024.jpg', label: 'Cabo Blanco 2024' },
  { value: 'assets/Noche-De-Estrellas-2024.jpg', label: 'Noche de Estrellas 2024' },
  { value: 'assets/Malvinas-2024.jpg', label: 'Malvinas 2024' }
]

const QSLCardSelector = ({ qslTemplate, onTemplateChange }) => {
  return (
    <div className="qsl-card-selector">
      <h2>Select QSL Card</h2>
      <p>Choose a QSL card template:</p>

      <div className="template-selector">
        <select
          value={qslTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="template-select"
        >
          <option value="">Select a QSL Card</option>
          {QSL_TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>

        {qslTemplate && (
          <div className="template-preview">
            <img src={qslTemplate} alt="Selected QSL Card" className="template-image" />
          </div>
        )}
      </div>
    </div>
  )
}

export default QSLCardSelector
