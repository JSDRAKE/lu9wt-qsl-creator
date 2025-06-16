import PropTypes from 'prop-types'
import { useMemo } from 'react'
import '../styles/components/QSLCardSelector.css'
import templatesData from '../data/qslTemplates.json'

// Import all QSL card images
const imageImports = import.meta.glob('../assets/qsl/*.jpg', { eager: true })
const images = {}

// Process image imports
Object.entries(imageImports).forEach(([path, module]) => {
  const imageName = path.split('/').pop().replace('.jpg', '')
  images[imageName] = module.default
})

// Process templates data with their corresponding images
const processTemplates = (templates, imagesMap) =>
  templates.map((template) => ({
    ...template,
    image: imagesMap[template.value]
  }))

const QSLCardSelector = ({ qslTemplate, onTemplateChange, error }) => {
  const templates = useMemo(() => processTemplates(templatesData, images), [])

  const selectedTemplate = useMemo(() => {
    if (!qslTemplate) return null
    const templateName = qslTemplate.split('/').pop().replace('.jpg', '')
    return templates.find((t) => t.value === templateName)
  }, [qslTemplate, templates])
  return (
    <div className="qsl-card-selector">
      <h2>Selección de QSL</h2>
      <p>Selecciona una plantilla QSL:</p>

      <div className="template-selector">
        <select
          value={qslTemplate || ''}
          onChange={(e) => {
            const selectedValue = e.target.value
            const template = templates.find((t) => t.id === selectedValue)
            onTemplateChange(template ? template.image : '')
          }}
          className="template-select"
          aria-label="Seleccionar plantilla QSL"
          aria-invalid={!!error}
        >
          <option value="">Elige una QSL</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>

        {selectedTemplate && (
          <div className="template-preview">
            <img
              src={selectedTemplate.image}
              alt={`Plantilla seleccionada: ${selectedTemplate.label}`}
              className="template-image"
            />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

QSLCardSelector.propTypes = {
  qslTemplate: PropTypes.string,
  onTemplateChange: PropTypes.func.isRequired,
  error: PropTypes.string
}

export default QSLCardSelector
