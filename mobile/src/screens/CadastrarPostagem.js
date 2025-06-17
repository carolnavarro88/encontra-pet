import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const CadastrarPostagem = ({ route, navigation }) => {
  const { usuarioId } = route.params
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')

  const handleCadastro = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }
    try {
      await axios.post(`${API_BASE_URL}/api/postagem`, {
        pessoaId: 1, // Substitua pelo ID do usuário atual
        titulo,
        descricao
      })
      Alert.alert('Sucesso', 'Postagem cadastrada com sucesso!')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a postagem.')
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})

export default CadastrarPostagem
