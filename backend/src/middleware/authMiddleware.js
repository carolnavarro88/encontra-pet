const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
//console.log(token, 'token recebido no middleware');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido!' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    
    if (err) {
      
      return res.status(403).json({ error: 'Token inválido' });
    }
    

    req.user = user;
    
    next();
  });
};

module.exports = authenticateToken;