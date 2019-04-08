'use strict'

const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const homeRoutes = require('./routes/homeRoutes')
const webhookRoutes = require('./routes/webhookRoutes')
require('dotenv').config()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const port = process.env.PORT || 3000

// instantiate a express object
const app = express()

// Security middleware
app.use(helmet())

app.use(helmet.contentSecurityPolicy({
  directives: {
    connectSrc: ["'self'"],
    imgSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'https://maxcdn.bootstrapcdn.com/'],
    scriptSrc: ["'self'", 'use.fontawesome.com', 'cdnjs.cloudflare.com', 'https://code.jquery.com/jquery-3.2.1.slim.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js']
  }
}))

// Setup websocket
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.set('socketio', io)

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log('Press Ctrl-C to terminate...\n')
})

// Setup view engine
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}))

app.set('view engine', 'hbs')

// Middleware
app.use(bodyParser.raw({
  inflate: true,
  limit: '1024kb',
  type: 'application/json'
}))

// Define routes
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', homeRoutes)
app.use('/webhook', webhookRoutes)

// Error handling
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'views', 'error', '404.html'))
})

// 403 forbidden or 500
app.use((err, req, res, next) => {
  if (err.message === '403') {
    res.status(403)
    res.sendFile(path.join(__dirname, 'views', 'error', '403.html'))
  } else {
    res.status(err.status || 500)
    res.send(err.message || 'internal Server Error')
  }
})
