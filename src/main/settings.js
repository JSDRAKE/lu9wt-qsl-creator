import { promises as fs } from 'fs'
import path from 'path'
import { app } from 'electron'

const settingsPath = path.join(app.getPath('userData'), 'settings.json')

// Default settings are now handled in the renderer process

// Get all settings
export const getSettings = async () => {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return null to indicate no settings
      return null
    }
    console.error('Error reading settings:', error)
    return null
  }
}

// Save all settings
export const saveSettings = async (settings) => {
  try {
    // Check if we have a valid settings object
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings object')
    }

    // Ensure the directory exists
    await fs.mkdir(path.dirname(settingsPath), { recursive: true })

    // Write the settings file
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving settings:', error)
    return {
      success: false,
      error: error.message || 'Error al guardar la configuración'
    }
  }
}

export default {
  getSettings,
  saveSettings
}
