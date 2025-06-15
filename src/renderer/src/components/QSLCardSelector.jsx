// Import all QSL card images
import CaboBlanco2020 from '../assets/qsl/Cabo-Blanco-2020.jpg'
import CaboBlanco2024 from '../assets/qsl/Cabo-Blanco-2024.jpg'
import FaroNovales2023 from '../assets/qsl/Faro-Novales-2023.jpg'
import LU2WA from '../assets/qsl/LU2WA.jpg'
import Malvinas2022 from '../assets/qsl/Malvinas-2022.jpg'
import Malvinas2023 from '../assets/qsl/Malvinas-2023.jpg'
import Malvinas2024 from '../assets/qsl/Malvinas-2024.jpg'
import NocheEstrellas2024 from '../assets/qsl/Noche-De-Estrellas-2024.jpg'
import Sarmiento2022 from '../assets/qsl/Sarmiento-2022.jpg'

const QSL_TEMPLATES = [
  { value: LU2WA, label: 'LU2WA' },
  { value: Sarmiento2022, label: 'Sarmiento 2022' },
  { value: Malvinas2022, label: 'Malvinas 2022' },
  { value: FaroNovales2023, label: 'Faro Novales 2023' },
  { value: Malvinas2023, label: 'Malvinas 2023' },
  { value: CaboBlanco2020, label: 'Cabo Blanco 2020' },
  { value: CaboBlanco2024, label: 'Cabo Blanco 2024' },
  {
    value: NocheEstrellas2024,
    label: 'Noche de Estrellas 2024'
  },
  { value: Malvinas2024, label: 'Malvinas 2024' }
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
