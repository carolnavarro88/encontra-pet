const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.user = user;
    next();
  });
};

// Função para criar um novo usuário
const createUsuario = (req, res) => {
  const { nome, email, senha, endereco, telefone } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha || !endereco || !telefone) {
    return res.status(400).json({ error: 'Nome, email, senha, endereço e telefone são obrigatórios.' });
  }

  // Verificar se o email já está cadastrado
  usuarioModel.getUsuarioByEmail(email, (err, usuarioExistente) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Já existe um usuário cadastrado com este email.' });
    }

    // Se o email não existir, chama o modelo para criar o novo usuário no banco de dados
    usuarioModel.createUsuario({ nome, email, senha, endereco, telefone }, (err, novoUsuario) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Usuário Cadastrado com sucesso!",
        data: novoUsuario
      });
    });
  });
};

// Função para atualizar os dados de um usuário
const updateUsuario = (req, res) => {
  const usuarioId = req.params.id; // ID do usuário a ser atualizado
  const { nome, email, senha, endereco, telefone } = req.body;

  // Verifica se pelo menos um campo foi enviado para atualização
  if (!nome && !email && !senha && !endereco && !telefone) {
    return res.status(400).json({ error: 'Pelo menos um campo precisa ser informado para atualização.' });
  }

  // Chama o modelo para atualizar o usuário no banco
  usuarioModel.updateUsuario(usuarioId, { nome, email, senha, endereco, telefone }, (err, usuarioAtualizado) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
    }

    if (!usuarioAtualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({
      message: "Usuário Atualizado com sucesso!",
      data: usuarioAtualizado
    });
  });
};

// Função para pegar um usuário pelo ID
const getUsuarioById = (req, res) => {
  const usuarioId = req.params.id; 
  console.log(usuarioId)
 
  usuarioModel.getUsuarioById(usuarioId, (err, usuario) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    
    const { senha, ...usuarioSemSenha } = usuario; 

    res.status(200).json({
      message: 'Usuário encontrado com sucesso!',
      data: usuarioSemSenha 
    });
  });
};

// Função para fazer o login de um usuário
const loginUsuario = (req, res) => {
  const { email, senha } = req.body;
  
  // Verifica se o email e senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  // Verifica se o usuário existe no banco de dados
  usuarioModel.getUsuarioByEmail(email, (err, usuario) => {
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar o usuário.' });
    }

    if (!usuario) {
      
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha fornecida com a senha armazenada (hash)
    bcrypt.compare(senha, usuario.senha, (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao comparar as senhas.' });
      }

      if (!resultado) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const { senha: _, ...usuarioSemSenha } = usuario; 

      // Gerar o token JWT
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login bem-sucedido!',
        token,
        data: usuarioSemSenha 
      });
    });
  });
};

// Exportando as funções do controlador
module.exports = { createUsuario, updateUsuario, loginUsuario, getUsuarioById };
