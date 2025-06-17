import { decodeJwt } from 'jose'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_BASE_URL } from '../config'

const renewTokenIfNeeded = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    console.log(token, 'Token Atual')
    if (!token) return null

    //console.log(token, 'Token atual e vai decodificar - PASSOU POR AQUI para verificar se precisa RENOVAR!!!');

    const decodedToken = decodeJwt(token)
    //console.log(decodedToken, 'decodeToken');
    const currentTime = Date.now() / 1000 // Tempo atual em segundos

    // Renova o token se estiver prestes a expirar (por exemplo, dentro de 10 minutos)
    if (decodedToken.exp < currentTime + 10 * 60) {
      //console.log('Token perto de expirar!');
      const response = await axios.post(
        `${API_BASE_URL}/api/renew-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const newToken = response.data.token

      await AsyncStorage.setItem('token', newToken)
      return newToken
    }

    return token
  } catch (error) {
    console.error('Erro ao renovar o token:', error)
    return null
  }
}

const authenticatedRequest = async (method, url, data = null) => {
  try {
    const token = await renewTokenIfNeeded()
    console.log(token, 'Token após verificação de expiração!')
    //console.log(token, 'Entrou no authenticateRequest')
    if (!token) throw new Error('Token não disponível')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    console.log(url)

    let response
    switch (method) {
      case 'get':
        response = await axios.get(url, config)
        break
      case 'post':
        response = await axios.post(url, data, config)
        break
      case 'put':
        response = await axios.put(url, data, config)
        break
      case 'delete':
        response = await axios.delete(url, config)
        break
      default:
        throw new Error('Método HTTP não suportado')
    }

    return response.data
  } catch (error) {
    console.error(
      `Erro na requisição ${method.toUpperCase()} para ${url}:`,
      error
    )
    throw error
  }
}

export { authenticatedRequest }
