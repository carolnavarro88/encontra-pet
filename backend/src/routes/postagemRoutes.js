const express = require('express');
const router = express.Router();
const postagemController = require('../controllers/postagemController');
const upload = require('../config/multer');
const authenticateToken = require('../middleware/authMiddleware');  

// Rota para criar uma nova postagem (protegida)
router.post('/', authenticateToken, upload.single('imagem'), postagemController.createPostagem);

// Rota para obter todas as postagens (pública)
router.get('/', postagemController.getAllPostagens);

// Rota para obter todas as postagens de um usuário pelo ID (protegida)
router.get('/:id', authenticateToken, postagemController.getPostagensByUsuarioId);

// Rota para atualizar uma postagem (protegida)
router.put('/:id', authenticateToken, postagemController.updatePostagem);

// Rota para deletar uma postagem (protegida)
router.delete('/:id', authenticateToken, postagemController.deletePostagem);

module.exports = router;