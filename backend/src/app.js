const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('../src/routes/authRoutes')

// Importando as rotas
const usuarioRoutes = require('./routes/usuarioRoutes')
const postagemRoutes = require('./routes/postagemRoutes') // Importa as rotas de postagens

const app = express()

// Middleware
app.use(cors())
app.use((req, res, next) => {
  if (req.url.endsWith('.bundle')) {
    res.setHeader('Content-Type', 'application/javascript')
  }
  next()
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(bodyParser.json())

// Configurando as rotas
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/postagens', postagemRoutes)
app.use('/api/renew-token', authRoutes) // Rota de renovação de token

app.use('/uploads', express.static('uploads'))

// Porta do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
