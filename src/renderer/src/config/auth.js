// Google OAuth2 Configuration for Desktop App
export const googleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  // Para aplicaciones de escritorio, usamos el flujo de dispositivo
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  // No necesitamos redirectUri para el flujo de dispositivo
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' '),
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent',
  // Tiempo de espera para la autenticación (en milisegundos)
  timeout: 300000 // 5 minutos
}

// API Endpoints
export const apiEndpoints = {
  googleAuth: '/api/auth/google',
  googleAuthCallback: '/api/auth/google/callback',
  userProfile: '/api/auth/me'
}
