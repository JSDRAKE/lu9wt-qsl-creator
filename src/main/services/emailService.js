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
        language === 'es'
          ? `${callsign} aquí tienes mi Tarjeta QSL`
          : `${callsign} here's my QSL Card`

      // Generate HTML email based on language
      const html =
        language === 'es'
          ? this.generateSpanishEmail(qslData, formattedDate, formattedTime)
          : this.generateEnglishEmail(qslData, formattedDate, formattedTime)

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
    // Extraer y formatear frecuencia y banda
    const frequency = qslData.frequency || ''
    const band = this._detectBand(frequency)

    if (qslData.time) {
      const [hours, minutes] = qslData.time.split(':')
      if (hours && minutes) {
        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
      }
    }

    return `
      <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 2rem auto; color: #2d3748; line-height: 1.6; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%); padding: 2rem; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.8rem; font-weight: 600; letter-spacing: 0.5px;">Confirmación de QSO</h1>
          <p style="margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem;">Tarjeta QSL Digital</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 2rem;">
        
        <div style="margin-bottom: 1.5rem;">
          ${(() => {
            let displayName = qslData.callsign || ''
            if (qslData.operatorName) {
              // Tomar solo el primer nombre
              const firstName = qslData.operatorName.split(' ')[0]
              displayName = `${firstName} ${qslData.callsign || ''}`.trim()
            }
            return `<p style="margin: 0 0 0.5rem; font-size: 1.1rem;">Hola <strong>${displayName}</strong>,</p>`
          })()}
          <p style="margin: 0 0 1.5rem; color: #4a5568;">Adjunto encontrarás mi Tarjeta QSL generada con los siguientes datos:</p>
        </div>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1.5rem; margin: 1.5rem 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <h3 style="margin: 0 0 1rem; color: #2d3748; font-size: 1.25rem; font-weight: 600; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background-color: #2b6cb0; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 14px;">📡</span>
            Datos del contacto
          </h3>
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 0.5rem;">
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; width: 140px; vertical-align: top;">Indicativo:</td>
              <td style="padding: 0.5rem 0; color: #2d3748; font-weight: 500;">${qslData.callsign || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Fecha:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Hora (UTC):</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Frecuencia:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">
                ${frequency || 'N/A'} MHz
              </td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Banda:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${band || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Modo:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${qslData.mode || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">RST:</td>
              <td style="padding: 0.5rem 0; color: #2d3748; font-weight: 500; font-size: 1.1rem;">
                <span style="color: #2f855a;">${qslData.report || 'N/A'}</span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 1.5rem; line-height: 1.7; color: #4a5568;">
            ¡Gracias por el QSO, <strong>${qslData.callsign}</strong>! Ha sido un placer contactarte. 
            He subido nuestro contacto a las siguientes plataformas: LoTW, eQSL, QRZ, HamQTH y ClubLog.
          </p>
          
          <div style="margin: 2rem 0; text-align: center;">
            <p style="margin: 0 0 0.5rem; font-size: 1.1rem; color: #2d3748; font-weight: 600;">
              ¡Hasta la próxima en las ondas hertzianas!
            </p>
            <p style="margin: 0; font-size: 1.4rem; color: #2b6cb0; font-weight: 700; letter-spacing: 1px;">
              73 & DX de LU9WT
            </p>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #718096;">
              <p style="margin: 0.25rem 0;">
                <a href="https://www.qrz.com/db/LU9WT" target="_blank" style="color: #2b6cb0; text-decoration: none;">
                  QRZ.com/db/LU9WT
                </a>
              </p>
            </div>
          </div>
          
          <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #a0aec0; text-align: center;">
            <p style="margin: 0 0 0.5rem;">
              Este correo electrónico y la Tarjeta QSL <br> fueron generados automáticamente por el software
            </p>
            <p style="margin: 0 0 0.25rem; font-weight: 600; color: #718096;">
              LU9WT QSL Creator
            </p>
            <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">
              © ${new Date().getFullYear()} JSDRAKE - LU9WT - Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    `
  }

  generateEnglishEmail(qslData, formattedDate, formattedTime) {
    // Extract frequency and band
    const frequency = qslData.frequency ? qslData.frequency.toString().replace('.', ',') : ''
    const band = this._detectBand(frequency)

    return `
      <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 2rem auto; color: #2d3748; line-height: 1.6; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%); padding: 2rem; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.8rem; font-weight: 600; letter-spacing: 0.5px;">QSO Confirmation</h1>
          <p style="margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem;">Digital QSL Card</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 2rem;">
        
        <div style="margin-bottom: 1.5rem;">
          ${(() => {
            let displayName = qslData.callsign || ''
            if (qslData.operatorName) {
              // Take only the first name
              const firstName = qslData.operatorName.split(' ')[0]
              displayName = `${firstName} ${qslData.callsign || ''}`.trim()
            }
            return `<p style="margin: 0 0 0.5rem; font-size: 1.1rem;">Hello <strong>${displayName}</strong>,</p>`
          })()}
          <p style="margin: 0 0 1.5rem; color: #4a5568;">Attached you'll find my QSL Card with the following details:</p>
        </div>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1.5rem; margin: 1.5rem 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <h3 style="margin: 0 0 1rem; color: #2d3748; font-size: 1.25rem; font-weight: 600; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background-color: #2b6cb0; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 14px;">📡</span>
            Contact Details
          </h3>
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 0.5rem;">
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; width: 140px; vertical-align: top;">Callsign:</td>
              <td style="padding: 0.5rem 0; color: #2d3748; font-weight: 500;">${qslData.callsign || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Date:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Time (UTC):</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Frequency:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">
                ${frequency || 'N/A'} MHz
              </td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Band:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${band || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">Mode:</td>
              <td style="padding: 0.5rem 0; color: #2d3748;">${qslData.mode || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600; color: #4a5568; vertical-align: top;">RST:</td>
              <td style="padding: 0.5rem 0; color: #2d3748; font-weight: 500; font-size: 1.1rem;">
                <span style="color: #2f855a;">${qslData.report || 'N/A'}</span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 1.5rem; line-height: 1.7; color: #4a5568;">
            Thank you for the QSO, <strong>${qslData.callsign}</strong>! It was a pleasure making contact with you.
            I've uploaded our contact to the following platforms: LoTW, eQSL, QRZ, HamQTH, and ClubLog.
          </p>
          
          <div style="margin: 2rem 0; text-align: center;">
            <p style="margin: 0 0 0.5rem; font-size: 1.1rem; color: #2d3748; font-weight: 600;">
              See you on the airwaves!
            </p>
            <p style="margin: 0; font-size: 1.4rem; color: #2b6cb0; font-weight: 700; letter-spacing: 1px;">
              73 & DX from LU9WT
            </p>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #718096;">
              <p style="margin: 0.25rem 0;">
                <a href="https://www.qrz.com/db/LU9WT" target="_blank" style="color: #2b6cb0; text-decoration: none;">
                  QRZ.com/db/LU9WT
                </a>
              </p>
            </div>
          </div>
          
          <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #a0aec0; text-align: center;">
            <p style="margin: 0 0 0.5rem;">
              This email and the QSL Card <br> were automatically generated by the software
            </p>
            <p style="margin: 0 0 0.25rem; font-weight: 600; color: #718096;">
              LU9WT QSL Creator
            </p>
            <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">
              © ${new Date().getFullYear()} JSDRAKE - LU9WT - All rights reserved
            </p>
          </div>
        </div>
      </div>
    `
  }

  // Backward compatibility
  generateHtmlEmail(qslData) {
    const formattedDate = qslData.date
    const formattedTime = qslData.time || ''
    return this.generateSpanishEmail(qslData, formattedDate, formattedTime)
  }
}

export default new EmailService()
