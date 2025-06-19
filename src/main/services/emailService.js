import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

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

  async sendQSL(to, qslData, qslImage) {
    console.log(
      'Sending QSL email with data:',
      JSON.stringify(
        {
          to,
          qslData,
          hasQslImage: !!qslImage,
          qslDataKeys: Object.keys(qslData || {})
        },
        null,
        2
      )
    )

    try {
      if (!this.initialized || !this.transporter) {
        const errorMsg =
          'El servicio de correo no está configurado correctamente. Por favor, verifica la configuración del servidor SMTP.'
        console.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Validar que tengamos los datos necesarios
      if (!to || !qslData || !qslImage) {
        const errorMsg = 'Faltan datos necesarios para enviar el correo'
        console.error(errorMsg, { to, hasQslData: !!qslData, hasQslImage: !!qslImage })
        throw new Error(errorMsg)
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(to)) {
        throw new Error('La dirección de correo electrónico no es válida')
      }

      // Extraer solo la parte base64 de la imagen si es una data URL
      const base64Data = qslImage.includes('base64,') ? qslImage.split('base64,')[1] : qslImage

      // Format date for filename (YYYY-MM-DD)
      const formattedDate = qslData.date
        ? qslData.date.split('/').reverse().join('-')
        : new Date().toISOString().split('T')[0]

      const callsign = (qslData.callsign || 'QSL').toUpperCase().replace(/\//g, '_')
      const filename = `QSL_${callsign}_${formattedDate}.jpg`

      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'QSL Creator'}" <${process.env.EMAIL_FROM}>`,
        to,
        subject: `QSL Card - ${callsign} - ${formattedDate}`,
        text: this.generatePlainTextEmail(qslData),
        html: this.generateHtmlEmail(qslData),
        attachments: [
          {
            filename,
            content: base64Data,
            encoding: 'base64',
            contentType: 'image/j'
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

  generatePlainTextEmail(qslData) {
    // Extract frequency and band information
    let frequency = qslData.frequency || ''
    let band = ''

    // If frequency is in MHz format (e.g., "14.250"), extract the band
    if (frequency && frequency.includes('.')) {
      const mhz = parseFloat(frequency)
      if (!isNaN(mhz)) {
        if (mhz >= 1.8 && mhz <= 2.0) band = '160m'
        else if (mhz >= 3.5 && mhz <= 4.0) band = '80m'
        else if (mhz >= 7.0 && mhz <= 7.3) band = '40m'
        else if (mhz >= 14.0 && mhz <= 14.35) band = '20m'
        else if (mhz >= 21.0 && mhz <= 21.45) band = '15m'
        else if (mhz >= 28.0 && mhz <= 29.7) band = '10m'
        else band = `${mhz} MHz`
      }
    }

    return `
Hola,

Adjunto encontrarás tu tarjeta QSL.

Datos del contacto:
Callsign: ${qslData.callsign || 'N/A'}
Fecha: ${qslData.date || 'N/A'}
Hora: ${qslData.time || 'N/A'}
Frecuencia: ${frequency} ${band ? `(${band})` : ''}
Banda: ${band || 'N/A'}
Modo: ${qslData.mode || 'N/A'}
RST: ${qslData.report || 'N/A'}

73!
`
  }

  generateHtmlEmail(qslData) {
    // Extract frequency and band information
    let frequency = qslData.frequency || ''
    let band = ''

    // Detect band from frequency if available
    if (frequency) {
      // Replace comma with dot and remove any other non-numeric characters except dot
      const cleanFrequency = frequency.replace(/,/g, '.').replace(/[^0-9.]/g, '')
      const mhz = parseFloat(cleanFrequency)
      if (!isNaN(mhz)) {
        if (mhz >= 1.8 && mhz <= 2.0) band = '160m'
        else if (mhz >= 3.5 && mhz <= 4.0) band = '80m'
        else if (mhz >= 7.0 && mhz <= 7.3) band = '40m'
        else if (mhz >= 14.0 && mhz <= 14.35) band = '20m'
        else if (mhz >= 21.0 && mhz <= 21.45) band = '15m'
        else if (mhz >= 28.0 && mhz <= 29.7) band = '10m'
        else band = `${mhz} MHz`
      }
    }

    // Format the date if available
    let formattedDate = qslData.date || 'N/A'
    if (qslData.date) {
      const [day, month, year] = qslData.date.split('/')
      if (day && month && year) {
        formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      }
    }

    // Format the time if available
    let formattedTime = qslData.time || 'N/A'
    if (qslData.time) {
      const [hours, minutes] = qslData.time.split(':')
      if (hours && minutes) {
        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} UTC`
      }
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">¡Tu tarjeta QSL está lista!</h2>
        
        <p>Hola,</p>
        <p>Adjunto encontrarás tu tarjeta QSL generada con los siguientes datos:</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Datos del contacto</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 140px; font-weight: bold;">Indicativo:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${qslData.callsign || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Fecha:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Hora:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Frecuencia:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                ${frequency || 'N/A'} MHz
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Banda:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${band || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Modo:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${qslData.mode || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">RST:</td>
              <td style="padding: 8px 0;">${qslData.report || 'N/A'}</td>
            </tr>
          </table>
        </div>
        
        <p>¡Gracias por usar LU9WT QSL Creator! Esperamos que disfrutes de tu tarjeta QSL.</p>
        
        <p>73,<br>El equipo de LU9WT</p>
        
        <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-style: italic;">
          Este es un mensaje automático, por favor no respondas a este correo.
        </p>
      </div>
    `
  }
}

export default new EmailService()
