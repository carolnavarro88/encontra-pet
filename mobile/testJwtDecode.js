const { default: jwtDecode } = require('jwt-decode');

const testToken = async () => {
  const token = 'seu_token_jwt_aqui'; // Substitua pelo seu token JWT para teste
  try {
    const decodedToken = jwtDecode(token);
    console.log('Token decodificado:', decodedToken);
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
  }
};

testToken();