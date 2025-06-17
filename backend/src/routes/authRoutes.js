const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //console.log(token, 'token recebido para renovação');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido!' });
  }

  // Decodificar o token para obter as informações do usuário
  const decoded = jwt.decode(token);
  
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido' });
  }

 
  const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token: newToken });
});

module.exports = router;