import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostagemCard = ({ postagem }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{postagem.titulo}</Text>
      <Text style={styles.descricao}>{postagem.descricao}</Text>
      <Text style={styles.data}>
        {new Date(postagem.dataPostagem).toLocaleString('pt-BR')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  data: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default PostagemCard;
