import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message'
import { API_BASE_URL } from '../config'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuarioId, setUsuarioId] = useState(null)
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleLogin = () => {
    if (!email || !senha) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Credenciais inválidas!'
      })
      return
    }

    autenticarUsuario(email, senha)
  }

  const autenticarUsuario = async (email, senha) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/usuarios/login`,
        {
          email: email,
          senha: senha
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const data = response.data
      console.log(data)
      if (data.token) {
        const usuarioId = data.data.id
        console.log(usuarioId, 'UsuarioId Preenchido')
        setUsuarioId(usuarioId)

        // Armazenar o token e o ID do usuário no AsyncStorage
        await AsyncStorage.setItem('token', data.token)
        await AsyncStorage.setItem('usuarioId', usuarioId.toString())

        navigation.navigate('Main', { usuarioId })
      } else {
        console.log('Erro ao logar:', data.error)
      }
    } catch (error) {
      if (error.response) {
        console.log('Error Response:', error.response)
        switch (error.response.status) {
          case 401:
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: 'Credenciais inválidas. Por favor, tente novamente.'
            })
            break
          case 404:
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2:
                'Usuário não encontrado. Por favor, verifique suas credenciais.'
            })
            break
          default:
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: `Ocorreu um erro inesperado: ${error.response.data.error}`
            })
        }
      } else if (error.request) {
        console.log('Request:', error.request)
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2:
            'Nenhuma resposta do servidor. Por favor, tente novamente mais tarde.'
        })
      } else {
        console.log('Error:', error.message)
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: `Erro: ${error.message}`
        })
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          <Icon
            name={secureTextEntry ? 'visibility' : 'visibility-off'}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Text style={styles.buttonText}>Criar conta gratuita</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff'
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60, // Faz a imagem ficar redonda
    alignSelf: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 18,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingLeft: 15,
    fontSize: 18
  },
  eyeIcon: {
    padding: 10
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default Login
