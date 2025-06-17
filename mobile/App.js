import 'react-native-gesture-handler'
import React, { useState, useEffect, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values'
// import 'react-native-quick-crypto'

// Importação das telas
import Login from './src/screens/TelaLogin'
import CadastroUsuario from './src/screens/CadastrarUsuario'
import TabNavigator from './src/navigation/TabNavigator'
import Toast from 'react-native-toast-message'

// Stack Navigator para navegação inicial
const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [usuarioId, setUsuarioId] = useState(null)

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const storedUsuarioId = await AsyncStorage.getItem('usuarioId')

        if (token && storedUsuarioId) {
          setIsLoggedIn(true)
          setUsuarioId(parseInt(storedUsuarioId))
          console.log(usuarioId, 'UsuarioId do App.js')
        }
      } catch (error) {
        console.error('Erro ao verificar a sessão do usuário:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserSession()
  }, [])

  if (isLoading) {
    return null // Ou um indicador de carregamento
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Login'}>
          {/* Tela de Login */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          {/* Tela de Cadastro de Usuário */}
          <Stack.Screen
            name="CadastroUsuario"
            component={CadastroUsuario}
            options={{ headerShown: true, title: 'Cadastro de Usuário' }}
          />

          {/* Navegação principal (Feed com Footer) */}
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
            initialParams={{ usuarioId }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  )
}
