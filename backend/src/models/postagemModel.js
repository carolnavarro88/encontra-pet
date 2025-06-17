const db = require('../database/db');

// Função para criar uma nova postagem
const createPostagem = (postagem, callback) => {
  const { nomeAnimal, dataUltimaVezVisto, local, descricao, imagem, usuarioId, dataInclusao } = postagem;
  console.log(imagem);
  console.log('Estou no model Create Postagem')
  console.log(postagem);
  
  // Caso a imagem seja um caminho (string), use diretamente
  const imagemPath = imagem ? imagem.path : null;

  
  db.run(
    "INSERT INTO Postagem (nomeAnimal, dataUltimaVezVisto, local, descricao, imagem, usuarioId, dataInclusao) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nomeAnimal, dataUltimaVezVisto, local, descricao, imagem, usuarioId, dataInclusao],
  
    function (err) {
      
      callback(err, { id: this.lastID, ...postagem });
    }
  );
};

// Função para obter todas as postagens
const getAllPostagens = (callback) => {
  db.all("SELECT * FROM Postagem ORDER BY dataInclusao", [], (err, rows) => callback(err, rows));
};

// Função para obter todas as postagens de um usuário pelo ID
const getPostagensByUsuarioId = (usuarioId, callback) => {
  console.log(usuarioId);
  const query = 'SELECT * FROM postagem WHERE usuarioId = ?'; // SQL para buscar as postagens por ID do usuário
  db.all(query, [usuarioId], (err, results) => {
    if (err) {
      return callback(err, null); // Retorna erro se houver
    }
    return callback(null, results); // Retorna os resultados (postagens) encontradas
  });
};
// Função para atualizar uma postagem
const updatePostagem = (id, postagem, callback) => {
  const { nomeAnimal, dataUltimaVezVisto, local, descricao, imagem } = postagem;
  console.log('Entrou no modelPostagemEdit')
  db.run(
    "UPDATE Postagem SET nomeAnimal = ?, dataUltimaVezVisto = ?, local = ?, descricao = ?, imagem = ? WHERE id = ?",
    [nomeAnimal, dataUltimaVezVisto, local, descricao, imagem, id],
    function (err) {
      callback(err, this.changes > 0);
    }
  );
};

// Função para deletar uma postagem
const deletePostagem = (id, callback) => {
  console.log('Postagem deletada!')
  db.run("DELETE FROM Postagem WHERE id = ?", [id], function (err) {
    callback(err, this.changes > 0);
  });
};

const getPostagemById = (id, callback) => {
  db.get("SELECT * FROM Postagem WHERE id = ?", [id], (err, row) => {
    callback(err, row); // Retorna a postagem se encontrada, ou null se não existir
  });
};

module.exports = {
  createPostagem,
  getAllPostagens,
  getPostagensByUsuarioId,
  updatePostagem,
  deletePostagem,
  getPostagemById
};
