import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appbar, Button, ActivityIndicator } from 'react-native-paper'
import { API_BASE_URL } from '../config'

const Perfil = ({ route, navigation }) => {
  const { usuarioId } = route?.params || {}
  const [usuarioInfo, setUsuarioInfo] = useState(null)

  const carregarUsuarioInfo = async usuarioId => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/usuarios/${usuarioId}`
      )
      setUsuarioInfo(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (usuarioId) {
        carregarUsuarioInfo(usuarioId)
      }
    }, [usuarioId])
  )

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('usuarioId')
      navigation.navigate('Login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Perfil do Usuário" />
      </Appbar.Header>
      {usuarioInfo ? (
        <>
          <Image source={{ uri: '' }} style={styles.profileImage} />
          <Text style={styles.userInfo}>Nome: {usuarioInfo.nome}</Text>
          <Text style={styles.userInfo}>Email: {usuarioInfo.email}</Text>
          <Text style={styles.userInfo}>Telefone: {usuarioInfo.telefone}</Text>
          <Button mode="contained" onPress={handleLogout} style={styles.button}>
            Logout
          </Button>
        </>
      ) : (
        <ActivityIndicator animating={true} size="large" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF'
  }
})

export default Perfil
