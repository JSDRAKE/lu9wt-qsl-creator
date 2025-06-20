import axios from 'axios'
import { getSettings } from '../settings.js'
import { parseXmlString } from '../utils/xmlParser.js'

class QRZService {
  constructor() {
    this.session = null
    this.sessionExpires = null
  }

  /**
   * Inicializa el servicio QRZ con credenciales
   * @returns {Promise<boolean>} True si la inicialización fue exitosa
   */
  async initialize() {
    try {
      console.log('Inicializando servicio QRZ...')
      const settingsResponse = await getSettings()

      if (!settingsResponse || !settingsResponse.success) {
        console.warn('No se pudo cargar la configuración')
        return false
      }

      const settingsData = settingsResponse.data || {}

      // Log settings data with sensitive information masked
      const maskedSettings = { ...settingsData }
      if (maskedSettings.qrzPassword) maskedSettings.qrzPassword = '***MASKED***'
      if (maskedSettings.profiles) {
        maskedSettings.profiles = maskedSettings.profiles.map((profile) => ({
          ...profile,
          qrzPassword: profile.qrzPassword ? '***MASKED***' : undefined
        }))
      }
      console.log(
        'Datos de configuración en servicio QRZ (información sensible enmascarada):',
        JSON.stringify(maskedSettings, null, 2)
      )

      // Get credentials from the root level or from the active profile
      let qrzUsername, qrzPassword

      if (settingsData.qrzUsername && settingsData.qrzPassword) {
        // Credentials at root level (legacy)
        console.log('Usando credenciales de nivel raíz')
        qrzUsername = settingsData.qrzUsername
        qrzPassword = settingsData.qrzPassword
      } else if (settingsData.activeProfileId && settingsData.profiles) {
        // Try to get from active profile
        console.log('Buscando credenciales en el perfil activo:', settingsData.activeProfileId)
        const activeProfile = settingsData.profiles.find(
          (profile) => profile.id === settingsData.activeProfileId
        )

        if (activeProfile) {
          console.log('Perfil activo encontrado:', activeProfile.name)
          qrzUsername = activeProfile.qrzUsername
          qrzPassword = activeProfile.qrzPassword
        } else {
          console.warn('No se encontró el perfil activo')
        }
      } else {
        console.warn('No se encontraron credenciales de QRZ en la configuración')
      }

      if (!qrzUsername || !qrzPassword) {
        console.warn('Credenciales de QRZ no configuradas')
        return false
      }

      console.log(
        'Credenciales encontradas, intentando autenticar con QRZ... (usuario: %s)',
        qrzUsername
      )
      const authResult = await this.authenticate(qrzUsername, qrzPassword)
      if (!authResult) {
        console.warn('No se pudo autenticar con QRZ')
      }
      return authResult
    } catch (error) {
      console.error('Error inicializando servicio QRZ:', error)
      return false
    }
  }

  /**
   * Autentica con la API de QRZ.com
   * @param {string} username - Nombre de usuario de QRZ
   * @param {string} password - Contraseña de QRZ
   * @returns {Promise<boolean>} True si la autenticación fue exitosa
   */
  async authenticate(username, password) {
    console.log('Iniciando autenticación con QRZ...', { username })

    try {
      const url = 'https://xmldata.qrz.com/xml/current/'
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)
      params.append('agent', 'lu9wt-qsl-creator/1.0')

      // Log request without sensitive data
      console.log('Enviando solicitud de autenticación a QRZ...', {
        url,
        params: {
          username,
          password: '***',
          agent: 'lu9wt-qsl-creator/1.0'
        }
      })

      const response = await axios.get(`${url}?${params.toString()}`, {
        timeout: 15000, // 15 segundos de timeout
        headers: {
          Accept: 'application/xml',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'lu9wt-qsl-creator/1.0'
        }
      })

      console.log('Respuesta de autenticación recibida', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })

      if (!response.data) {
        throw new Error('La respuesta de autenticación está vacía')
      }

      console.log('Respuesta XML recibida:', response.data)
      const result = this.parseXmlResponse(response.data)
      console.log('Respuesta parseada:', JSON.stringify(result, null, 2))

      if (!result.QRZDatabase) {
        console.error('Formato de respuesta inesperado: falta QRZDatabase')
        throw new Error('Formato de respuesta inesperado del servidor QRZ')
      }

      const session = result.QRZDatabase.Session || {}
      console.log('Datos de sesión recibidos:', JSON.stringify(session, null, 2))

      // Verificar si hay un mensaje de error
      if (session.Error) {
        console.error('Error en la respuesta de QRZ:', session.Error)
        throw new Error(session.Error)
      }

      // Verificar si la sesión está vacía
      if (Object.keys(session).length === 0) {
        console.error('La sesión está vacía en la respuesta de QRZ')
        throw new Error('No se pudo iniciar sesión: respuesta vacía del servidor')
      }

      if (session && session.Key) {
        const sessionKey = session.Key
        const sessionUser = session.Username || username // Fallback to provided username if not in response

        if (!sessionKey) {
          console.error('Error: La clave de sesión está vacía')
          return false
        }

        this.session = {
          key: sessionKey,
          username: sessionUser
        }

        // Session expires in 1 hour (or use SubExp time if available)
        this.sessionExpires = session.SubExp
          ? new Date(session.SubExp).getTime()
          : Date.now() + 3600000

        console.log(
          'Autenticación exitosa. Sesión válida hasta:',
          new Date(this.sessionExpires).toISOString()
        )
        return true
      }

      // If we get here, authentication failed
      const errorMessage = session?.Error
        ? `Error de QRZ: ${session.Error}`
        : result.QRZDatabase?.Session?.Error
          ? `Error de QRZ: ${result.QRZDatabase.Session.Error}`
          : 'Error desconocido - No se pudo obtener la clave de sesión'

      console.error('Error de autenticación QRZ:', errorMessage)
      console.error('Respuesta completa de la API:', JSON.stringify(result, null, 2))
      return false
    } catch (error) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method
      }
      console.error(
        'Error en la solicitud de autenticación QRZ:',
        JSON.stringify(errorDetails, null, 2)
      )
      return false
    }
  }

  /**
   * Obtiene información de un indicativo
   * @param {string} callsign - Indicativo a buscar
   * @returns {Promise<Object|null>} Datos del indicativo o null si hay error
   */
  async getCallsignInfo(callsign) {
    try {
      console.log(`Buscando información del indicativo: ${callsign}`)

      // Verificar si la sesión está activa
      if (!this.session || Date.now() > this.sessionExpires) {
        console.log('La sesión ha expirado o no existe, inicializando...')
        const initialized = await this.initialize()
        if (!initialized) {
          console.error('No se pudo inicializar el servicio QRZ')
          return null
        }
      }

      console.log('Realizando solicitud a la API de QRZ...')
      const response = await axios.get('https://xmldata.qrz.com/xml/current/', {
        params: {
          s: this.session.key,
          callsign: callsign.toUpperCase()
        },
        timeout: 15000,
        headers: {
          'User-Agent': 'lu9wt-qsl-creator/1.0'
        }
      })

      console.log('Respuesta recibida de QRZ. Estado:', response.status)
      const result = this.parseXmlResponse(response.data)
      console.log('Datos parseados de QRZ:', JSON.stringify(result, null, 2))

      const qrzData = result.QRZDatabase
      if (!qrzData) {
        console.error('Formato de respuesta inesperado de QRZ')
        return null
      }

      if (qrzData.Callsign) {
        // The data is already in a good format from the parser
        const info = { ...qrzData.Callsign }
        // Log success with some basic info (without sensitive data)
        const logInfo = { ...info }
        delete logInfo.key // Remove sensitive session key if present
        console.log('Información del indicativo obtenida:', JSON.stringify(logInfo, null, 2))
        return info
      }

      // Handle error cases
      let errorMessage = 'Error desconocido'
      const session = qrzData.Session || {}
      if (session.Error) {
        errorMessage = session.Error

        // Check for session expiration
        if (
          errorMessage.toLowerCase().includes('session timeout') ||
          errorMessage.toLowerCase().includes('invalid session key')
        ) {
          console.log('La sesión ha expirado, intentando renovar...')
          this.session = null
          return this.getCallsignInfo(callsign) // Retry with new session
        }
      }

      console.error('Error en la respuesta de QRZ:', errorMessage)
      return null
    } catch (error) {
      console.error('Error en consulta QRZ:', error.message)
      return null
    }
  }

  /**
   * Parse QRZ XML response to JavaScript object
   * @private
   */
  parseXmlResponse(xmlString) {
    try {
      return parseXmlString(xmlString)
    } catch (error) {
      console.error('Error parsing XML:', error)
      return {}
    }
  }
}

// Exportar una instancia única del servicio
export default new QRZService()
