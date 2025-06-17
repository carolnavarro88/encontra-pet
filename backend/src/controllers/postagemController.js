const postagemModel = require('../models/postagemModel');
const upload = require('../config/multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Função para criar uma nova postagem
const createPostagem = (req, res) => {
  const { nomeAnimal, dataUltimaVezVisto, local, descricao } = req.body;
  const imagem = req.file; // multer salva a imagem em req.file
  const usuarioId = req.user.id; // Pega o ID do usuário do token
  console.log(req.body, 'Idusuario Criacao Postagem!!')

  if (!nomeAnimal || !dataUltimaVezVisto || !local || !descricao || !imagem) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  // Caminho da imagem salvo no banco
  const imagemPath = path.join('uploads', imagem.filename);

  const dataInclusao = new Date().toISOString();
  console.log('Até aqui está tudo certo na criação da postagem')

  postagemModel.createPostagem(
    { nomeAnimal, dataUltimaVezVisto, local, descricao, imagem: imagemPath, usuarioId, dataInclusao },
    (err, novaPostagem) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Postagem cadastrada com sucesso!",
        data: novaPostagem,
      });
    }
  );
};

// Função para obter todas as postagens
const getAllPostagens = (req, res) => {
  postagemModel.getAllPostagens((err, postagens) => {
    if (err) return res.status(500).json({ error: err.message });

    // Para cada postagem, busque a imagem e converta para base64
    const postagensComImagemBase64 = postagens.map(postagem => {
      const caminhoImagem = postagem.imagem;
      return getImageBase64(caminhoImagem)
        .then(imagemBase64 => {
          postagem.imagemBase64 = imagemBase64;
          return postagem;
        })
        .catch(err => {
          console.error(`Erro ao ler a imagem ${postagem.imagem}:`, err);
          postagem.imagemBase64 = null; // Se ocorrer erro, define como null
          return postagem;
        });
    });

    // Espera todas as promessas antes de retornar
    Promise.all(postagensComImagemBase64)
      .then(postagensComImagemBase64Final => {
        res.json(postagensComImagemBase64Final); // Retorna as postagens com a imagem em Base64
      })
      .catch(err => {
        console.error('Erro ao processar as imagens:', err);
        res.status(500).json({ error: 'Erro ao processar as imagens.' });
      });
  });
};

// Função para obter todas as postagens de um usuário pelo ID
const getPostagensByUsuarioId = (req, res) => {
  const usuarioId = req.user.id;
  console.log(usuarioId, 'idUsuario');
  postagemModel.getPostagensByUsuarioId(usuarioId, (err, postagens) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!postagens || postagens.length === 0) return res.status(404).json({ message: 'Nenhuma postagem encontrada para este usuário.' });

    const postagensComImagemBase64 = postagens.map(postagem => {
      const caminhoImagem = postagem.imagem;
      return getImageBase64(caminhoImagem)
        .then(imagemBase64 => {
          postagem.imagemBase64 = imagemBase64;
          return postagem;
        })
        .catch(err => {
          console.error(`Erro ao ler a imagem ${postagem.imagem}:`, err);
          postagem.imagemBase64 = null;
          return postagem;
        });
    });

    Promise.all(postagensComImagemBase64)
      .then(postagensComBase64 => {
        console.log(postagensComBase64);
        res.json(postagensComBase64);
      })
      .catch(err => {
        console.error('Erro ao processar as imagens:', err);
        res.status(500).json({ error: 'Erro ao processar as imagens.' });
      });
  });
};

//Funcão para atualizar a postagem
const updatePostagem = async (req, res) => {
  const { id } = req.params; // ID da postagem a ser atualizada
  console.log(id, 'idpassadoDaPostagem')
  console.log(req.body);
  const { nomeAnimal, dataUltimaVezVisto, local, descricao, imagemBase64 } = req.body;

  if (!nomeAnimal || !dataUltimaVezVisto || !local || !descricao || !imagemBase64) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    // Decodificar Base64 e salvar a nova imagem no servidor
    const matches = imagemBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato Base64 inválido.' });
    }

    const fileType = matches[1]; // Exemplo: image/png
    const base64Data = matches[2]; // Dados da imagem em Base64
    const fileExtension = fileType.split('/')[1]; // Exemplo: png

    // Gerar um nome único para o arquivo
    const uniqueFileName = `imagem_${Date.now()}.${fileExtension}`;
    const filePath = path.join('uploads', uniqueFileName);

    // Salvar o arquivo no servidor
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.promises.writeFile(filePath, buffer);

    // Atualizar a postagem no banco de dados com o novo caminho da imagem
    postagemModel.updatePostagem(
      id,
      { nomeAnimal, dataUltimaVezVisto, local, descricao, imagem: filePath },
      (err, success) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!success) return res.status(404).json({ message: 'Postagem não encontrada.' });

        res.json({ message: 'Postagem atualizada com sucesso.', caminhoImagem: filePath });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar a postagem.' });
  }
};

// Função para deletar uma postagem
const deletePostagem = (req, res) => {
  const { id } = req.params;

  // Primeiro, obtenha a postagem para recuperar o caminho da imagem
  postagemModel.getPostagemById(id, (err, postagem) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!postagem) return res.status(404).json({ message: 'Postagem não encontrada.' });

    const filePath = postagem.imagem;

    // Remova o arquivo do servidor
    fs.unlink(filePath, (err) => {
      if (err) {        
        return res.status(500).json({ error: 'Erro ao deletar o arquivo.' });
      }

      // Depois de deletar o arquivo, delete o registro da postagem no banco de dados
      postagemModel.deletePostagem(id, (err, success) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!success) return res.status(404).json({ message: 'Postagem não encontrada.' });
        res.json({ message: 'Postagem excluída com sucesso.' });
      });
    });
  });
};

// Função para converter a imagem em base64
const getImageBase64 = (imagePath) => {
  return new Promise((resolve, reject) => {
    const basePath = process.env.SERVER_BASE_PATH || ''; // Use o valor padrão se não estiver definido no .env
    const filePath = path.join(basePath, imagePath); // Monta o caminho final para o arquivo

    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const base64Image = Buffer.from(data).toString('base64');
      resolve(base64Image);
    });
  });
};

module.exports = {
  createPostagem,
  getAllPostagens,
  getPostagensByUsuarioId,
  updatePostagem,
  deletePostagem,
  getImageBase64
};
