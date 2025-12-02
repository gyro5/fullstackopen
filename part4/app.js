const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGO_URI, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)

module.exports = app