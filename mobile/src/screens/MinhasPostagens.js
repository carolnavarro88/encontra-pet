import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native'
import axios from 'axios'
import * as ImagePicker from 'react-native-image-picker'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authenticatedRequest } from '../services/requests'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { API_BASE_URL } from '../config'

const MinhasPostagens = ({ route }) => {
  const [minhasPostagens, setMinhasPostagens] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [opacity, setOpacity] = useState(new Animated.Value(1))
  const [postagemEditando, setPostagemEditando] = useState(null)
  const [postagemParaExcluir, setPostagemParaExcluir] = useState(null)
  const [nome, setNome] = useState('')
  const [dataUltimaVezVisto, setDataUltimaVezVisto] = useState()
  const [local, setLocal] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState(null) // Estado para armazenar a imagem
  const { usuarioId } = route?.params || {}
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const fetchMinhasPostagens = async () => {
    try {
      console.log('Entrou no fetch')
      const token = await AsyncStorage.getItem('token')
      console.log(token, 'TOKEN no Buscar MInhas postagens!!!')
      const response = await authenticatedRequest(
        'get',
        `${API_BASE_URL}/api/postagens/${usuarioId}`
      )
      console.log('Resposta da API', response)
      setMinhasPostagens(response)
    } catch (error) {
      console.error('Erro ao buscar minhas postagens:', error)
    }
  }

  const openEditModal = postagem => {
    console.log(postagem)
    setPostagemEditando(postagem)
    setNome(postagem.nomeAnimal)
    setDataUltimaVezVisto(postagem.dataUltimaVezVisto)
    setLocal(postagem.local)
    setDescricao(postagem.descricao)
    setImagem(
      postagem.imagem
        ? `${API_BASE_URL}/${postagem.imagem.replace(/\\/g, '/')}`
        : null
    )
    setIsModalVisible(true)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200, // Duração da animação de entrada
      useNativeDriver: true
    }).start()
  }

  const showDatePicker = () => {
    console.log('Show DatePicker')
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    console.log('Hide DatePicker')
    setDatePickerVisibility(false)
  }

  const handleConfirm = date => {
    setDataUltimaVezVisto(date)
    hideDatePicker()
  }

  const handleEditPostagem = async () => {
    try {
      const updatedPostagem = {
        ...postagemEditando,
        nomeAnimal: nome,
        dataUltimaVezVisto: dataUltimaVezVisto,
        local: local,
        descricao: descricao,
        imagemBase64: imagem ? imagem : postagemEditando.imagemBase64
      }

      console.log(updatedPostagem, 'updatePostagem')

      const response = await authenticatedRequest(
        'put',
        `${API_BASE_URL}/api/postagens/${postagemEditando.id}`,
        updatedPostagem
      )

      fetchMinhasPostagens()
      setIsModalVisible(false)
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Postagem atualizada com sucesso.'
      })
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Ocorreu um erro ao editar a postagem.'
      console.error('Erro ao editar postagem:', errorMessage)
    }
  }

  const confirmDeletePostagem = postagem => {
    setPostagemParaExcluir(postagem)
    setIsDeleteModalVisible(true)
  }

  const handleDeletePostagem = async postId => {
    try {
      console.log(postId)
      const response = await authenticatedRequest(
        'delete',
        `${API_BASE_URL}api/postagens/${postId}`
      )

      // Exibe mensagem de sucesso após exclusão
      setIsDeleteModalVisible(false)

      // Atualiza a lista de postagens após a exclusão
      fetchMinhasPostagens()
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Postagem excluída com sucesso.'
      })
    } catch (error) {
      console.error('Erro na exclusão da postagem:', error)
      const errorMessage = error.response
        ? error.response.data.message
        : 'Ocorreu um erro ao deletar a postagem.'
      Alert.alert('Erro', errorMessage)
    }
  }

  const chooseImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage)
      } else {
        setImagem(response.assets[0].uri)
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      console.log('Está atualizando!')
      if (usuarioId) {
        fetchMinhasPostagens()
      }
    }, [usuarioId])
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Postagens</Text>
      {/* Lista de postagens */}
      <FlatList
        data={minhasPostagens}
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
              {/* Botões para editar ou excluir postagem */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => confirmDeletePostagem(item)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma postagem encontrada.</Text>
        }
      />

      {/* Modal de edição */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.modalTitle}>Editar Postagem</Text>
              <Text style={styles.label}>Nome do Animal</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do Animal"
                value={nome}
                onChangeText={setNome}
              />
              <Text style={styles.label}>Data Última Vez Vista</Text>
              {Platform.OS === 'web' ? (
                <TextInput
                  style={styles.input}
                  type="date"
                  value={dataUltimaVezVisto}
                  onChange={e => setDataUltimaVezVisto(e.target.value)}
                />
              ) : (
                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                  <Text>{dataUltimaVezVisto}</Text>
                </TouchableOpacity>
              )}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Text style={styles.label}>Local</Text>
              <TextInput
                style={styles.input}
                placeholder="Local"
                value={local}
                onChangeText={setLocal}
              />
              <Text style={styles.label}>Observação</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observação"
                value={descricao}
                onChangeText={setDescricao}
                multiline={true}
                numberOfLines={4}
              />
              <Text style={styles.label}>Alterar Imagem</Text>
              <TouchableOpacity style={styles.button} onPress={chooseImage}>
                <Text style={styles.buttonText}>Escolher Imagem</Text>
              </TouchableOpacity>
              {imagem && (
                <Image source={{ uri: imagem }} style={styles.selectedImage} />
              )}{' '}
              {/* Exibe a imagem escolhida */}
              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  onPress={() => setIsModalVisible(false)}
                />
                <Button title="Salvar" onPress={handleEditPostagem} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>
              Tem certeza que deseja excluir esta postagem?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.buttonModal, { backgroundColor: 'red' }]}
                onPress={() => handleDeletePostagem(postagemParaExcluir?.id)}
              >
                <Text style={styles.buttonModalText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, { backgroundColor: 'gray' }]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.buttonModalText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10
  },
  postagem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden'
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  postContent: {
    padding: 15
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  postInfo: {
    fontSize: 14,
    color: '#555'
  },
  postDetail: {
    fontWeight: 'bold'
  },
  postDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  scrollContainer: {
    flexGrow: 1
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginTop: 10
  },
  deleteModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5
  },
  deleteModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButtonsContainer: {
    flexDirection: 'row', // Coloca os itens lado a lado
    justifyContent: 'space-between', // Adiciona espaço entre os botões
    marginTop: 20
  },
  // Estilo específico para o textarea
  textArea: {
    height: 100, // Define uma altura maior para o campo de texto
    textAlignVertical: 'top' // Garante que o texto comece no topo do campo
  },
  buttonModal: {
    flex: 1, // Faz com que os botões ocupem o mesmo espaço
    marginHorizontal: 5, // Adiciona um espaço entre os botões
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  buttonModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default MinhasPostagens
