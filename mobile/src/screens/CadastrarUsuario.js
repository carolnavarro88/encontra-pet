import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native'
import Toast from 'react-native-toast-message'
import { API_BASE_URL } from '../config'

const CadastroUsuario = ({ navigation }) => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')

  const handleCadastro = async () => {
    console.log('Botão cadastro')
    if (!nome || !email || !senha || !endereco || !telefone) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Todos os campos são obrigatórios!',
        autoHide: true, // Define se o Toast deve desaparecer automaticamente
        visibilityTime: 4000, // Tempo em milissegundos que o Toast ficará visível
        onPress: () => {
          Toast.hide() // Função para esconder o Toast ao clicar nele
        },
        topOffset: 50 // Ajusta a posição do Toast na tela
      })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          endereco,
          telefone
        })
      })

      const data = await response.json()

      if (response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Todos os campos são obrigatórios!',
          autoHide: true, // Define se o Toast deve desaparecer automaticamente
          visibilityTime: 4000, // Tempo em milissegundos que o Toast ficará visível
          onPress: () => {
            Toast.hide() // Função para esconder o Toast ao clicar nele
          },
          topOffset: 50 // Ajusta a posição do Toast na tela
        })
        navigation.goBack() // Retorna à tela de login após o cadastro
      } else {
        Alert.alert('Erro', data.error || 'Algo deu errado, tente novamente!')
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão, tente novamente mais tarde!')
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
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

export default CadastroUsuario
