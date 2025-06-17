const db = require('../database/db'); // Supondo que o arquivo de conexão com o banco esteja em '../db'
const bcrypt = require('bcrypt');

// Função para verificar se um usuário existe pelo email
const getUsuarioByEmail = (email, callback) => {
  db.get("SELECT * FROM Usuario WHERE email = ?", [email], (err, row) => {
    
    callback(err, row); // Retorna o usuário se encontrado, ou null se não existir
  });
};

// Função para criar um novo usuário
const createUsuario = (usuario, callback) => {
  const { nome, email, senha, endereco, telefone } = usuario;

  // Criptografando a senha antes de salvar no banco
  bcrypt.hash(senha, 10, (err, hashedSenha) => {
    if (err) return callback(err);

    // Salvando o usuário com a senha criptografada
    db.run(
      "INSERT INTO Usuario (nome, email, senha, endereco, telefone) VALUES (?, ?, ?, ?, ?)",
      [nome, email, hashedSenha, endereco, telefone],
      function (err) {
        if (err) return callback(err);
        
        // Criando o objeto do usuário sem a senha antes de retornar
        const novoUsuario = {
          id: this.lastID,
          nome,
          email,
          endereco,
          telefone
        };
        
        // Retornar o usuário sem a senha
        callback(null, novoUsuario);
      }
    );
  });
};

// Função para fazer o login de um usuário
function loginUsuario(req, res) {
  const { email, senha } = req.body;

  // Verifica se o email e senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  // Verifica se o usuário existe no banco de dados
  usuarioModel.getUsuarioByEmail(email, (err, usuario) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar o usuário.' });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Compara a senha fornecida com a senha armazenada (hash)
    bcrypt.compare(senha, usuario.senha, (err, resultado) => {
      if (err) return res.status(500).json({ error: 'Erro ao comparar as senhas.' });
      if (!resultado) return res.status(401).json({ error: 'Senha incorreta.' });

      // Senha correta, login bem-sucedido
      res.status(200).json({
        message: 'Login bem-sucedido!',
        data: usuario, // Retorna os dados do usuário ou token (se estiver utilizando JWT)
      });
    });
  });
}

const getUsuarioById = (usuarioId, callback) => {
  console.log(usuarioId)
  // Supondo que você esteja usando MySQL ou outro banco relacional
  const query = 'SELECT * FROM usuario WHERE id = ?';

  db.all(query, [usuarioId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    // Verifica se o usuário foi encontrado
    if (results.length === 0) {
      return callback(null, null); // Nenhum usuário encontrado
    }

    return callback(null, results[0]); // Retorna o primeiro resultado
  });
};

// Função para atualizar os dados de um usuário
const updateUsuario = (id, usuario, callback) => {
  const { nome, email, senha, endereco, telefone } = usuario;
  db.run(
    "UPDATE Usuario SET nome = ?, email = ?, senha = ?, endereco = ?, telefone = ? WHERE id = ?",
    [nome, email, senha, endereco, telefone, id],
    function (err) {
      callback(err, this.changes > 0);
    }
  );
};

module.exports = { getUsuarioByEmail, createUsuario, loginUsuario, updateUsuario, getUsuarioById };
