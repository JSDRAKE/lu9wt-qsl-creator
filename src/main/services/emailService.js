import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import {
  generateSpanishEmail,
  generateArgentinaEmail,
  generateEnglishEmail
} from '../templates/emailTemplates'

dotenv.config()

class EmailService {
  constructor() {
    this.transporter = null
    this.initialized = false
    this.initialize()
  }

  async initialize() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com'
    const port = parseInt(process.env.SMTP_PORT) || 587
    const user = process.env.SMTP_USER || ''
    const pass = process.env.SMTP_PASS || ''
    const secure = process.env.SMTP_SECURE === 'true'

    // Validate required configuration
    if (!host || !user || !pass) {
      console.warn('SMTP configuration is incomplete. Email sending will be disabled.')
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000, // 10 seconds timeout
        greetingTimeout: 10000, // 10 seconds timeout
        socketTimeout: 10000 // 10 seconds timeout
      })

      // Verify connection configuration
      await this.verifyConnection()
      this.initialized = true
      console.log('Email service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      this.transporter = null
    }
  }

  async verifyConnection() {
    if (!this.transporter) return false

    try {
      const success = await this.transporter.verify()
      console.log('SMTP server is ready to take our messages')
      return success
    } catch (error) {
      console.error('SMTP connection verification failed:', error)
      throw new Error(`No se pudo conectar al servidor de correo: ${error.message}`)
    }
  }

  async sendQSL(to, qslData, qslImage, language = 'es') {
    console.log('Sending QSL email with data:', {
      to,
      hasQslData: !!qslData,
      hasQslImage: !!qslImage,
      qslDataKeys: qslData ? Object.keys(qslData) : []
    })

    try {
      // Validate required data
      if (!to || !qslData || !qslImage) {
        const errorMsg = 'Missing required data to send email'
        console.error(errorMsg, { to, hasQslData: !!qslData, hasQslImage: !!qslImage })
        throw new Error(errorMsg)
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(to)) {
        throw new Error('Invalid email address')
      }

      // Extract base64 data from image
      const base64Data = qslImage.includes('base64,') ? qslImage.split('base64,')[1] : qslImage

      // Get the date parts from the input (assuming format DD/MM/YYYY)
      const dateParts = qslData.date ? qslData.date.split('/') : []
      let formattedDate = qslData.date || new Date().toLocaleDateString()

      // If we have a valid date, format it according to the language
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts
        new Date(year, month - 1, day) // Validate date

        if (language === 'es') {
          // For Spanish: DD/MM/YYYY
          formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
        } else {
          // For English: MM/DD/YYYY
          formattedDate = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`
        }
      }

      // Keep the time as is without any conversion
      const formattedTime = qslData.time || ''
      const callsign = (qslData.callsign || 'QSL').toUpperCase().replace(/\//g, '_')
      const filename = `QSL_${callsign}_${new Date().toISOString().split('T')[0]}.jpg`

      // Generate subject based on language
      const subject =
        language === 'en'
          ? `${callsign} here's my QSL Card`
          : `${callsign} aquí tienes mi Tarjeta QSL`

      // Get the first name from the qslData or use the callsign as fallback
      const firstName = qslData.firstName || qslData.callsign

      // Generate HTML email based on language
      const html =
        language === 'es_ar'
          ? generateArgentinaEmail(
              qslData,
              formattedDate,
              formattedTime,
              qslData.frequency,
              qslData.band,
              firstName
            )
          : language === 'es'
            ? generateSpanishEmail(
                qslData,
                formattedDate,
                formattedTime,
                qslData.frequency,
                qslData.band,
                firstName
              )
            : generateEnglishEmail(
                qslData,
                formattedDate,
                formattedTime,
                qslData.frequency,
                qslData.band,
                firstName
              )

      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'LU9WT'}" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        attachments: [
          {
            filename,
            content: base64Data,
            encoding: 'base64',
            contentType: 'image/jpeg'
          }
        ]
      })

      console.log('Email sent:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error.message || 'Error desconocido al enviar el correo'
      }
    }
  }

  /**
   * Detecta la banda a partir de la frecuencia en MHz
   * @param {string} frequency - Frecuencia en formato de cadena (puede contener comas o puntos)
   * @returns {string} - Nombre de la banda o frecuencia formateada
   */
  _detectBand(frequency) {
    if (!frequency) return ''

    // Reemplazar comas por puntos y limpiar caracteres no numéricos
    const cleanFrequency = frequency
      .toString()
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '')
    const mhz = parseFloat(cleanFrequency)

    if (isNaN(mhz)) return ''

    if (mhz >= 1.8 && mhz <= 2.0) return '160m'
    if (mhz >= 3.5 && mhz <= 4.0) return '80m'
    if (mhz >= 7.0 && mhz <= 7.3) return '40m'
    if (mhz >= 14.0 && mhz <= 14.35) return '20m'
    if (mhz >= 21.0 && mhz <= 21.45) return '15m'
    if (mhz >= 28.0 && mhz <= 29.7) return '10m'
    if (mhz >= 50.0 && mhz <= 54.0) return '6m'
    if (mhz >= 144.0 && mhz <= 148.0) return '2m'
    if (mhz >= 222.0 && mhz <= 225.0) return '70cm'
    if (mhz >= 430.0 && mhz <= 440.0) return '23cm'

    return `${mhz} MHz`
  }

  generateSpanishEmail(qslData, formattedDate, formattedTime) {
    const frequency = qslData.frequency ? qslData.frequency.toString().replace('.', ',') : ''
    const band = this._detectBand(frequency)
    return generateSpanishEmail(qslData, formattedDate, formattedTime, frequency, band)
  }

  generateArgentinaEmail(qslData, formattedDate, formattedTime) {
    const frequency = qslData.frequency ? qslData.frequency.toString().replace('.', ',') : ''
    const band = this._detectBand(frequency)
    return generateArgentinaEmail(qslData, formattedDate, formattedTime, frequency, band)
  }

  generateEnglishEmail(qslData, formattedDate, formattedTime) {
    const frequency = qslData.frequency ? qslData.frequency.toString().replace('.', ',') : ''
    const band = this._detectBand(frequency)
    return generateEnglishEmail(qslData, formattedDate, formattedTime, frequency, band)
  }

  // Backward compatibility
  generateHtmlEmail(qslData) {
    const formattedDate = qslData.date
    const formattedTime = qslData.time || ''
    return this.generateSpanishEmail(qslData, formattedDate, formattedTime)
  }
}

export default new EmailService()
