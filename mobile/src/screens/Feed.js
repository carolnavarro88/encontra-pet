import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList
} from 'react-native'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authenticatedRequest } from '../services/requests'
import { API_BASE_URL } from '../config'

const Feed = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)
  const [nome, setNome] = useState('')
  const [dataUltimaVezVisto, setDataUltimaVezVisto] = useState('')
  const [local, setLocal] = useState('')
  const [observacao, setObservacao] = useState('')
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [postagens, setPostagens] = useState([])
  const [usuarioInfo, setUsuarioInfo] = useState(null)

  const carregarPostagens = async () => {
    try {
      const response = await authenticatedRequest(
        'get',
        `${API_BASE_URL}/api/postagens`
      )
      console.log(response)
      setPostagens(response)
    } catch (error) {
      console.error('Erro ao carregar postagens:', error)
      Alert.alert('Erro', 'Não foi possível carregar as postagens.')
    }
  }

  // Função para carregar as informações do usuário
  const carregarUsuarioInfo = async usuarioId => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/usuarios/${usuarioId}`
      )
      setUsuarioInfo(response.data.data)
      console.log(response.data.data)
      setIsUserModalVisible(true) // Exibe o modal de informações do usuário
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error)
      Alert.alert(
        'Erro',
        'Não foi possível carregar as informações do usuário.'
      )
    }
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const enviarPostagem = async () => {
    if (!nome || !dataUltimaVezVisto || !local || !observacao || !imagem) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Todos os campos são obrigatórios!'
      })
      return
    }

    const formData = new FormData()
    formData.append('nomeAnimal', nome)
    formData.append('dataUltimaVezVisto', dataUltimaVezVisto)
    formData.append('local', local)
    formData.append('descricao', observacao)
    formData.append('imagem', imagem)
    formData.append('usuarioId', 1)

    try {
      const token = await AsyncStorage.getItem('token')
      const response = await authenticatedRequest(
        'post',
        `${API_BASE_URL}/api/postagens`,
        formData
      )
      console.log(response)
      setIsModalVisible(false)
      setNome('')
      setDataUltimaVezVisto('')
      setLocal('')
      setObservacao('')
      setImagem(null)
      setPreview(null)
      carregarPostagens()
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Postagem cadastrada com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao criar postagem:', error)
      Alert.alert('Erro', 'Ocorreu um erro ao criar a postagem!')
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('Está atualizando!')
      carregarPostagens()
    }, [])
  )

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Nova Postagem</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de postagens */}
      <FlatList
        data={postagens}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postagem}>
            <Image
              source={{
                uri: `${API_BASE_URL}/${item.imagem.replace(/\\/g, '/')}`
              }}
              style={styles.postImage}
            />
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{item.nomeAnimal}</Text>
              <Text style={styles.postInfo}>
                Visto por último em:{' '}
                <Text style={styles.postDetail}>{item.dataUltimaVezVisto}</Text>
              </Text>
              <Text style={styles.postInfo}>
                Local: <Text style={styles.postDetail}>{item.local}</Text>
              </Text>
              <Text style={styles.postDescription}>{item.descricao}</Text>
              {/* Botão para ver as informações do usuário */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => carregarUsuarioInfo(item.usuarioId)}
              >
                <Text style={styles.buttonText}>Notificar Dono</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma postagem encontrada.</Text>
        }
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Postagem</Text>

            {/* Campos de entrada */}
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Data Última Vez Vista"
              value={dataUltimaVezVisto}
              onChangeText={setDataUltimaVezVisto}
            />
            <TextInput
              style={styles.input}
              placeholder="Local"
              value={local}
              onChangeText={setLocal}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observação"
              value={observacao}
              onChangeText={setObservacao}
              multiline={true}
              numberOfLines={4}
            />

            {/* Input para upload de arquivo */}
            <View>
              <Text style={styles.fileInputLabel}>Selecione uma imagem</Text>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              {preview && (
                <Image source={{ uri: preview }} style={styles.imagePreview} />
              )}
            </View>

            {/* Botões */}
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setIsModalVisible(false)}
              />
              <Button title="Criar" onPress={enviarPostagem} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal para exibir informações do usuário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUserModalVisible}
        onRequestClose={() => setIsUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações do Usuário</Text>

            {/* Exibindo informações do usuário */}
            {usuarioInfo ? (
              <>
                <Text style={styles.userInfo}>Nome: {usuarioInfo.nome}</Text>
                <Text style={styles.userInfo}>Email: {usuarioInfo.email}</Text>
                <Text style={styles.userInfo}>
                  Telefone: {usuarioInfo.telefone}
                </Text>
                {/* Adicione outros dados do usuário conforme necessário */}
              </>
            ) : (
              <Text>Carregando...</Text>
            )}

            {/* Botões */}
            <Button
              title="Fechar"
              onPress={() => setIsUserModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  postagem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10
  },
  postContent: {
    padding: 10
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  postInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  postDetail: {
    fontWeight: 'bold'
  },
  postDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333'
  },
  fileInputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  fileInput: {
    marginBottom: 15
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userInfo: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10
  }
})

export default Feed
