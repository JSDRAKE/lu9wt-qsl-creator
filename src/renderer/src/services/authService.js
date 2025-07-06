import { googleConfig } from '../config/auth'

// Función para generar un código de verificación aleatorio
const generateVerificationCode = () => {
  const array = new Uint32Array(28)
  window.crypto.getRandomValues(array)
  return Array.from(array, (dec) => `0${dec.toString(16)}`.substr(-2)).join('')
}

export const authService = {
  // Iniciar el flujo de autenticación de Google para aplicaciones de escritorio
  async loginWithGoogle() {
    // Generar un código de verificación único
    const codeVerifier = generateVerificationCode()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)
    const state = generateVerificationCode()

    // Construir la URL de autorización
    const authUrl = new URL(googleConfig.authUrl)
    const params = {
      client_id: googleConfig.clientId,
      response_type: 'code', // Usamos 'code' para el flujo de autorización
      scope: googleConfig.scope,
      redirect_uri: 'http://localhost:5173', // Solo para la validación, no se usa realmente
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256', // Usamos PKCE para mayor seguridad
      access_type: 'offline',
      prompt: 'consent'
    }

    // Agregar parámetros a la URL
    Object.keys(params).forEach((key) => authUrl.searchParams.append(key, params[key]))

    // Abrir la ventana de autenticación
    const authWindow = window.open(authUrl.toString(), 'google_auth', 'width=500,height=600')

    // Escuchar el mensaje con el código de autorización
    return new Promise((resolve, reject) => {
      const messageListener = async (event) => {
        try {
          // Verificar que el mensaje sea del origen esperado
          if (event.origin !== window.location.origin) return

          // Verificar que el mensaje contenga un código de autorización
          if (event.data && event.data.type === 'AUTH_CODE_RECEIVED') {
            const { code, receivedState } = event.data

            // Verificar el estado para prevenir CSRF
            if (receivedState !== state) {
              throw new Error('Invalid state parameter')
            }

            // Intercambiar el código por un token de acceso
            const tokenResponse = await this.exchangeCodeForToken(code, codeVerifier)

            // Obtener el perfil del usuario
            const userProfile = await this.getUserProfile(tokenResponse.access_token)

            // Guardar los tokens y el perfil
            localStorage.setItem('auth_token', tokenResponse.access_token)
            localStorage.setItem('refresh_token', tokenResponse.refresh_token || '')
            localStorage.setItem('user_profile', JSON.stringify(userProfile))

            // Cerrar la ventana y resolver la promesa
            authWindow?.close()
            window.removeEventListener('message', messageListener)
            resolve(userProfile)
          }
        } catch (error) {
          console.error('Authentication error:', error)
          authWindow?.close()
          window.removeEventListener('message', messageListener)
          reject(error)
        }
      }

      window.addEventListener('message', messageListener)

      // Verificar periódicamente si la ventana se cerró manualmente
      const checkWindow = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkWindow)
          window.removeEventListener('message', messageListener)
          reject(new Error('Authentication window was closed'))
        }
      }, 500)
    })
  },

  // Generar el code challenge para PKCE
  async generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Intercambiar el código de autorización por un token de acceso
  async exchangeCodeForToken(code, codeVerifier) {
    const response = await fetch(googleConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: googleConfig.clientId,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173' // Debe coincidir con el redirect_uri de la solicitud de autorización
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || 'Error exchanging code for token')
    }

    return response.json()
  },

  // Obtener el perfil del usuario usando el token de acceso
  async getUserProfile(accessToken) {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    return response.json()
  },

  // Cerrar sesión
  async logout() {
    // Limpiar tokens y datos de usuario
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_profile')

    // Opcional: Redirigir a la página de inicio o login
    window.location.href = '/'
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  // Obtener el perfil del usuario
  getProfile() {
    const profile = localStorage.getItem('user_profile')
    return profile ? JSON.parse(profile) : null
  }
}

export default authService
