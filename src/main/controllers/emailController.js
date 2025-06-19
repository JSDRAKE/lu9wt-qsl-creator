import emailService from '../services/emailService.js'
import { ipcMain } from 'electron'

/**
 * Configura los manejadores IPC para las operaciones relacionadas con correos electrónicos
 */
function setupEmailHandlers() {
  /**
   * Manejador para enviar un correo electrónico con una QSL
   * @param {string} to - Dirección de correo electrónico del destinatario
   * @param {object} qslData - Datos de la QSL
   * @param {string} qslImage - Imagen de la QSL en formato base64
   * @returns {Promise<{success: boolean, messageId?: string, error?: string}>} - Resultado de la operación
   */
  ipcMain.handle('send-qsl-email', async (event, { to, qslData, qslImage }) => {
    try {
      console.log('Solicitud de envío de QSL a:', to)
      console.log('Datos de QSL:', JSON.stringify(qslData, null, 2))

      if (!to || !qslData || !qslImage) {
        console.error('Faltan parámetros requeridos')
        return {
          success: false,
          error: 'Faltan parámetros requeridos: to, qslData o qslImage'
        }
      }

      const result = await emailService.sendQSL(to, qslData, qslImage)

      if (result.success) {
        console.log('Correo enviado exitosamente:', result.messageId)
      } else {
        console.error('Error al enviar correo:', result.error)
      }

      return result
    } catch (error) {
      console.error('Error en el manejador de envío de correo:', error)
      return {
        success: false,
        error: error.message || 'Error desconocido al procesar la solicitud de correo'
      }
    }
  })

  // Puedes agregar más manejadores de correo electrónico aquí según sea necesario
}

export { setupEmailHandlers }
