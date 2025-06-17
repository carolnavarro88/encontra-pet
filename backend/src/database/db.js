const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho absoluto para o banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'bancoPet.db'), (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Banco de dados aberto com sucesso!');
  }
});

// Forçar criação das tabelas
db.serialize(() => {
 
  // Criar a tabela Usuario
  db.run(`
    CREATE TABLE IF NOT EXISTS Usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      endereco TEXT,
      telefone TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela Usuario:', err.message);
    } else {
      console.log('Tabela Usuario criada com sucesso!');
    }
  });

  // Criar a tabela Postagem
  db.run(`
    CREATE TABLE IF NOT EXISTS Postagem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,      
      nomeAnimal TEXT NOT NULL,
      dataUltimaVezVisto TEXT,
      local TEXT NOT NULL,
      descricao TEXT,
      imagem TEXT,
      dataInclusao DATETIME,
      usuarioId TEXT NOT NULL,
      FOREIGN KEY (usuarioId) REFERENCES Usuario (id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela Postagem:', err.message);
    } else {
      console.log('Tabela Postagem criada com sucesso!');
    }
  });
});

module.exports = db;
