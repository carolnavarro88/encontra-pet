const multer = require('multer');
const path = require('path');

// Defina o armazenamento e o destino para o arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Gera nome único
  }
});

// Configuração do `multer`
const upload = multer({ storage: storage });

module.exports = upload;
