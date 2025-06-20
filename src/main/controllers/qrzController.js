import QRZService from '../services/qrzService.js'
import { getSettings } from '../settings.js'

class QRZController {
  constructor() {
    this.qrzService = QRZService
    this.initialized = false
    this.credentials = null
  }

  /**
   * Inicializa el controlador QRZ
   */
  async initialize() {
    if (this.initialized) {
      console.log('QRZ Controller ya está inicializado')
      return true
    }

    let settingsResponse
    try {
      console.log('Inicializando controlador QRZ...')
      console.log('Obteniendo configuración...')
      settingsResponse = await getSettings()
      console.log('Configuración obtenida correctamente')

      // Check if we have settings and data
      if (!settingsResponse || !settingsResponse.success) {
        const errorMsg = settingsResponse?.error || 'Respuesta inválida'
        console.warn('No se pudo cargar la configuración:', errorMsg)
        return false
      }

      // Handle case where settings.data might be null or undefined
      const settingsData = settingsResponse.data || {}
      console.log('Datos de configuración cargados')

      // Get credentials from active profile first, fall back to root level
      let qrzUsername, qrzPassword
      let credentialSource = 'none' // Used for logging purposes only
      let profileName = ''

      // First try to get from active profile
      if (settingsData.activeProfileId && settingsData.profiles) {
        console.log('Buscando credenciales en el perfil activo:', settingsData.activeProfileId)
        const activeProfile = settingsData.profiles.find(
          (profile) => profile.id === settingsData.activeProfileId
        )

        if (activeProfile) {
          profileName = activeProfile.name
          console.log('Perfil activo encontrado:', profileName)

          if (activeProfile.qrzUsername && activeProfile.qrzPassword) {
            qrzUsername = activeProfile.qrzUsername
            qrzPassword = activeProfile.qrzPassword
            credentialSource = `profile:${profileName}`
            console.log('Usando credenciales del perfil activo:', credentialSource)
          } else {
            console.warn('El perfil activo no tiene credenciales de QRZ configuradas')
          }
        } else {
          console.warn('No se encontró el perfil activo con ID:', settingsData.activeProfileId)
        }
      } else {
        console.warn('No hay perfiles configurados o no hay un perfil activo')
      }

      // If no credentials from profile, try root level (legacy support)
      if ((!qrzUsername || !qrzPassword) && settingsData.qrzUsername && settingsData.qrzPassword) {
        qrzUsername = settingsData.qrzUsername
        qrzPassword = settingsData.qrzPassword
        credentialSource = 'root'
        console.log('Usando credenciales de nivel raíz')
      }

      // Final check if we have credentials
      if (!qrzUsername || !qrzPassword) {
        console.warn('No se encontraron credenciales de QRZ válidas en ninguna ubicación')
        return false
      }

      console.log('Credenciales QRZ encontradas en:', credentialSource)

      // Almacenar credenciales para reconexión si es necesario
      this.credentials = { qrzUsername, qrzPassword }

      // Inicializar servicio con credenciales
      this.initialized = await this.qrzService.authenticate(qrzUsername, qrzPassword)

      if (!this.initialized) {
        console.warn('No se pudo autenticar con QRZ. Verifica tus credenciales.')
      }

      return this.initialized
    } catch (error) {
      console.error('Error inicializando controlador QRZ:', error)
      this.initialized = false
      return false
    }
  }

  /**
   * Obtiene información de un indicativo
   * @param {string} callsign - Indicativo a buscar
   * @returns {Promise<Object>} Datos del indicativo
   */
  async getCallsignInfo(callsign) {
    if (!callsign) {
      return { success: false, error: 'Se requiere un indicativo' }
    }

    // Intentar inicializar si no está inicializado
    if (!this.initialized) {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          error: 'No se pudo conectar al servicio QRZ. Verifica tus credenciales.'
        }
      }
    }

    try {
      console.log(`Buscando información del indicativo: ${callsign}`)
      const info = await this.qrzService.getCallsignInfo(callsign)
      if (!info) {
        const errorMsg = 'No se encontró información para el indicativo en QRZ'
        console.warn(errorMsg)
        return { success: false, error: errorMsg }
      }

      console.log('Información del indicativo obtenida correctamente')
      return { success: true, data: info }
    } catch (error) {
      console.error('Error obteniendo información del indicativo:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Obtiene el correo electrónico de un indicativo si está disponible
   * @param {string} callsign - Indicativo a buscar
   * @returns {Promise<Object>} Objeto con el correo electrónico si está disponible
   */
  async getEmailFromCallsign(callsign) {
    console.log(`Iniciando búsqueda de email para el indicativo: ${callsign}`)

    if (!callsign || typeof callsign !== 'string' || callsign.trim() === '') {
      const error = 'Se requiere un indicativo válido'
      console.error(error)
      return { success: false, error }
    }

    // Normalizar el indicativo (eliminar espacios y convertir a mayúsculas)
    const normalizedCallsign = callsign.trim().toUpperCase()
    console.log(`Buscando email para el indicativo: ${normalizedCallsign}`)

    // Verificar si el controlador está inicializado
    if (!this.initialized) {
      console.log('Inicializando controlador QRZ...')
      const initialized = await this.initialize()
      if (!initialized) {
        const error =
          'No se pudo inicializar el controlador QRZ. Verifica las credenciales en la configuración.'
        console.error(error)
        return { success: false, error }
      }
    }

    try {
      console.log(`Buscando información del indicativo ${normalizedCallsign} en QRZ...`)
      const result = await this.qrzService.getCallsignInfo(normalizedCallsign)

      if (!result) {
        const error = `No se encontró información para el indicativo ${normalizedCallsign} en QRZ`
        console.warn(error)
        return { success: false, error }
      }

      console.log('Datos del indicativo recibidos:', JSON.stringify(result, null, 2))

      // El email puede venir en diferentes campos según la API de QRZ
      const email =
        [
          result.email,
          result.Email,
          result.EMAIL,
          result.email_list && result.email_list[0]
        ].filter(Boolean)[0] || ''
      const trimmedEmail = email.trim()

      console.log(`Email encontrado para ${normalizedCallsign}:`, trimmedEmail || 'No disponible')

      if (!trimmedEmail) {
        const error = `El indicativo ${normalizedCallsign} no tiene correo electrónico registrado en QRZ o no es público`
        console.warn(error)
        return { success: false, error }
      }

      // Obtener nombre del operador si está disponible
      const name = [result.fname, result.name, result.nickname, result.first_name, result.last_name]
        .filter(Boolean)
        .join(' ')
        .trim()

      const response = {
        success: true,
        email: trimmedEmail,
        callsign: result.call || result.callsign || normalizedCallsign,
        name: name || ''
      }

      console.log('Respuesta exitosa para búsqueda de email:', JSON.stringify(response, null, 2))
      return response
    } catch (error) {
      const errorMessage = `Error obteniendo email del indicativo ${normalizedCallsign}: ${error.message}`
      console.error(errorMessage, error)

      // Intentar proporcionar un mensaje de error más amigable
      let userFriendlyError = 'Error al buscar el correo electrónico en QRZ'

      if (error.message.includes('timeout') || error.message.includes('time out')) {
        userFriendlyError =
          'Tiempo de espera agotado al conectar con el servicio QRZ. Por favor, inténtalo de nuevo más tarde.'
      } else if (error.message.includes('network') || error.message.includes('Network Error')) {
        userFriendlyError =
          'Error de red al conectar con el servicio QRZ. Verifica tu conexión a internet.'
      } else if (
        error.message.includes('credentials') ||
        error.message.includes('authentication')
      ) {
        userFriendlyError =
          'Error de autenticación con QRZ. Por favor, verifica tus credenciales en la configuración.'
      }

      return {
        success: false,
        error: userFriendlyError,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    }
  }
}

// Exportar una instancia única del controlador
export default new QRZController()
