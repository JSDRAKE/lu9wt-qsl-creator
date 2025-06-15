/**
 * Generates a QSL image based on a template and form data
 * @param {string} templateImage - QSL template image URL
 * @param {Object} formData - Form data
 * @param {string} formData.callsign - Station callsign
 * @param {string} formData.date - Contact date (DD/MM/YYYY)
 * @param {string} formData.time - Contact time (HH:MM)
 * @param {string} formData.frequency - Frequency in MHz
 * @param {string} formData.report - RST report
 * @param {string} formData.mode - Operation mode
 * @returns {Promise<string>} - Promise that resolves with the generated image URL
 */
export const generateQSL = async (templateImage, formData) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Set up canvas with image dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw the background image
      context.drawImage(img, 0, 0)

      // Set up text style
      context.font = 'bold 23px Georgia'
      context.fillStyle = 'black'
      context.textAlign = 'left'

      const upperCallsign = formData.callsign.toUpperCase()
      const upperMode = formData.mode.toUpperCase()

      // Adjust callsign position based on length
      if (upperCallsign.length === 6) {
        context.fillText(upperCallsign, 70, 460)
      } else if (upperCallsign.length === 5) {
        context.fillText(upperCallsign, 75, 460)
      } else if (upperCallsign.length === 4) {
        context.fillText(upperCallsign, 85, 460)
      } else {
        context.fillText(upperCallsign, 70, 460)
      }

      // Adjust date and time position
      context.fillText(formData.date, 210, 460)
      context.fillText(formData.time, 360, 460)

      // Adjust frequency position based on length
      if (formData.frequency.length === 9) {
        context.fillText(formData.frequency, 453, 460)
      } else if (formData.frequency.length === 10) {
        context.fillText(formData.frequency, 447, 460)
      } else if (formData.frequency.length === 11) {
        context.fillText(formData.frequency, 435, 460)
      } else {
        context.fillText(formData.frequency, 453, 460)
      }

      // Adjust report position
      if (formData.report.length === 3) {
        context.fillText(formData.report, 590, 460)
      } else {
        context.fillText(formData.report, 597, 460)
      }

      // Adjust mode position
      if (upperMode.length === 4) {
        context.fillText(upperMode, 655, 460)
      } else {
        context.fillText(upperMode, 660, 460)
      }

      // Convert to data URL
      const imgData = canvas.toDataURL('image/jpeg', 0.9)
      resolve(imgData)
    }

    // If there's an error loading the image
    img.onerror = () => {
      console.error('Error al cargar la imagen de la plantilla')
      resolve(null)
    }

    // Load the template image
    img.src = templateImage
  })
}
