import { promises as fs } from 'fs'
import path from 'path'
import { app } from 'electron'

const userDataPath = app.getPath('userData')
const filePath = path.join(userDataPath, 'user-data.json')

const defaultData = {
  callsign: '',
  name: '',
  city: '',
  gridLocator: '',
  email: ''
}

// Get user data
export const getUserData = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default data
      return { ...defaultData }
    }
    console.error('Error reading user data:', error)
    return { ...defaultData }
  }
}

// Save user data
export const saveUserData = async (data) => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return data
  } catch (error) {
    console.error('Error saving user data:', error)
    throw error
  }
}

export default {
  getUserData,
  saveUserData
}
