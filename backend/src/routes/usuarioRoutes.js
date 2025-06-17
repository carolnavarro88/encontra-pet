const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // Certifique-se de que o caminho está correto

// Rota para criar um novo usuário
router.post('/', usuarioController.createUsuario);

// Rota para pegar o usuário pelo ID
router.get('/:id', usuarioController.getUsuarioById);

// Rota para atualizar os dados de um usuário pelo ID
router.put('/:id', usuarioController.updateUsuario);

// Rota para fazer login de um usuário
router.post('/login', usuarioController.loginUsuario);

module.exports = router;
