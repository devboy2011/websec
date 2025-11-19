require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const adminAuthRoutes = require('./routes/admin-auth.routes')

const app = express()

// init middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

// init db
require('./dbs/init.mongodb')

// define routes
app.use('/api/auth', authRoutes)
app.use('/api/admin/auth', adminAuthRoutes)

// handle errors
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500 // error server code
  return res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Internal server error',
  })
})

module.exports = app