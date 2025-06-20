/**
 * Utility for interacting with QRZ.com API from the renderer process
 */

/**
 * Fetches email address for a callsign from QRZ.com
 * @param {string} callsign - The callsign to look up
 * @returns {Promise<{success: boolean, email?: string, error?: string}>}
 */
export async function getEmailFromCallsign(callsign) {
  try {
    if (!callsign) {
      return { success: false, error: 'Se requiere un indicativo' }
    }

    // Call the main process to handle the QRZ API request
    const result = await window.electron.ipcRenderer.invoke('qrz-get-email', callsign)

    if (!result.success) {
      console.error('Error getting email from QRZ:', result.error)
      return { success: false, error: result.error }
    }

    return {
      success: true,
      email: result.email,
      callsign: result.callsign || callsign,
      name: result.name || ''
    }
  } catch (error) {
    console.error('Error in getEmailFromCallsign:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener el correo electrónico'
    }
  }
}

/**
 * Fetches callsign info from QRZ.com
 * @param {string} callsign - The callsign to look up
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function getCallsignInfo(callsign) {
  try {
    if (!callsign) {
      return { success: false, error: 'Se requiere un indicativo' }
    }

    // Call the main process to handle the QRZ API request
    const result = await window.electron.ipcRenderer.invoke('qrz-get-callsign-info', callsign)

    if (!result.success) {
      console.error('Error getting callsign info from QRZ:', result.error)
      return { success: false, error: result.error }
    }

    return {
      success: true,
      data: result.data || {}
    }
  } catch (error) {
    console.error('Error in getCallsignInfo:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener la información del indicativo'
    }
  }
}

export default {
  getEmailFromCallsign,
  getCallsignInfo
}
