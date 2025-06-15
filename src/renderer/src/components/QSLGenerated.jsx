import PropTypes from 'prop-types'

const QSLGenerated = ({ qslData, onDownload, onSend }) => {
  return (
    <div className="qsl-generated">
      <h2>QSL Generada</h2>

      <div className="generated-image-container">
        <img src={qslData.imageUrl} alt="Generated QSL" className="generated-image" />
      </div>

      <div className="qsl-actions">
        <button onClick={onDownload} className="btn btn-primary">
          Descargar QSL
        </button>
        <button onClick={onSend} className="btn btn-secondary">
          Enviar QSL
        </button>
      </div>
    </div>
  )
}

QSLGenerated.propTypes = {
  qslData: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired
}

export default QSLGenerated
