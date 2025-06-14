const QSLGenerated = ({ qslData, onDownload, onSend }) => {
  return (
    <div className="qsl-generated">
      <h2>Generated QSL</h2>

      <div className="generated-image-container">
        <img src={qslData.imageUrl} alt="Generated QSL" className="generated-image" />
      </div>

      <div className="qsl-actions">
        <button onClick={onDownload} className="btn btn-primary">
          Download QSL
        </button>
        <button onClick={onSend} className="btn btn-secondary">
          Send QSL
        </button>
      </div>
    </div>
  )
}

export default QSLGenerated
