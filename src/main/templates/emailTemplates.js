/**
 * Plantillas de correo electrónico para la aplicación LU9WT QSL Creator
 *
 * Este archivo contiene las plantillas HTML para los correos electrónicos
 * en diferentes idiomas: español (es), español argentino (es_ar) e inglés (en).
 */

/**
 * Genera el contenido HTML para un correo en español estándar
 * @param {Object} qslData - Datos de la QSL
 * @param {string} formattedDate - Fecha formateada
 * @param {string} formattedTime - Hora formateada
 * @param {string} frequency - Frecuencia de la comunicación
 * @param {string} band - Banda de la comunicación
 * @param {string} [firstName] - Nombre del destinatario (opcional)
 * @returns {string} HTML del correo
 */
const generateSpanishEmail = (
  qslData,
  formattedDate,
  formattedTime,
  frequency,
  band,
  firstName = qslData.firstName || qslData.callsign
) => {
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
          ¡Gracias por el QSO, <strong>${firstName}</strong>! Ha sido un placer contactarte. 
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
            Digital QSL Card Creator by LU9WT
          </p>
          <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">
            © ${new Date().getFullYear()} JSDRAKE - LU9WT - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  `
}

/**
 * Genera el contenido HTML para un correo en español argentino
 * @param {Object} qslData - Datos de la QSL
 * @param {string} formattedDate - Fecha formateada
 * @param {string} formattedTime - Hora formateada
 * @param {string} frequency - Frecuencia de la comunicación
 * @param {string} band - Banda de la comunicación
 * @param {string} [firstName] - Nombre del destinatario (opcional)
 * @returns {string} HTML del correo
 */
const generateArgentinaEmail = (
  qslData,
  formattedDate,
  formattedTime,
  frequency,
  band,
  firstName = qslData.firstName || qslData.callsign
) => {
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
          ¡Gracias por el QSO, <strong>${firstName}</strong>! Ha sido un placer contactarte. 
          He subido nuestro contacto a las siguientes plataformas: LoTW, eQSL, QRZ, HamQTH y ClubLog. <br>
          A LdA lo subo el 1 de cada mes. Si necesitas que suba a alguna otra plataforma adicional, por favor házmelo saber.
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
            Digital QSL Card Creator by LU9WT
          </p>
          <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">
            © ${new Date().getFullYear()} JSDRAKE - LU9WT - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  `
}

/**
 * Genera el contenido HTML para un correo en inglés
 * @param {Object} qslData - Datos de la QSL
 * @param {string} formattedDate - Fecha formateada
 * @param {string} formattedTime - Hora formateada
 * @param {string} frequency - Frecuencia de la comunicación
 * @param {string} band - Banda de la comunicación
 * @param {string} [firstName] - Nombre del destinatario (opcional)
 * @returns {string} HTML del correo
 */
const generateEnglishEmail = (
  qslData,
  formattedDate,
  formattedTime,
  frequency,
  band,
  firstName = qslData.firstName || qslData.callsign
) => {
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
          Thank you for the QSO, <strong>${firstName}</strong>! It was a pleasure making contact with you.
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
            Digital QSL Card Creator by LU9WT
          </p>
          <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">
            © ${new Date().getFullYear()} JSDRAKE - LU9WT - All rights reserved
          </p>
        </div>
      </div>
    </div>
  `
}

export { generateArgentinaEmail, generateEnglishEmail, generateSpanishEmail }
