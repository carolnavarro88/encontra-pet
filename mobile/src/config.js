import Constants from 'expo-constants'
import { Platform } from 'react-native'

const getApiUrl = () => {
  const deviceSettings = Constants.expoConfig?.[Platform.OS] || {}

  return deviceSettings.apiUrl || 'http://localhost:3000'
}

export const API_BASE_URL = getApiUrl()
