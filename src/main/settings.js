import { promises as fs } from 'fs'
import path from 'path'
import { app } from 'electron'

const settingsPath = path.join(app.getPath('userData'), 'settings.json')

const defaultSettings = {
  // General Settings
  theme: 'light',
  language: 'es',
  notifications: true,
  // Profile Settings
  profiles: [
    {
      id: '1',
      name: 'Perfil Principal',
      callsign: '',
      fullName: '',
      qth: '',
      country: ''
    }
  ],
  activeProfileId: '1',
  // User Settings
  email: '',
  password: '',
  rememberMe: true,
  // External Service Settings
  externalApiKey: '',
  autoSync: false
}

// Get all settings
export const getSettings = async () => {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default settings
      await saveSettings(defaultSettings)
      return defaultSettings
    }
    console.error('Error reading settings:', error)
    return defaultSettings
  }
}

// Save all settings
export const saveSettings = async (settings) => {
  try {
    await fs.mkdir(path.dirname(settingsPath), { recursive: true })
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
    return settings
  } catch (error) {
    console.error('Error saving settings:', error)
    throw error
  }
}

export default {
  getSettings,
  saveSettings
}
