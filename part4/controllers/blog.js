const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// Router for '/api/blogs' route

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', async (request, response) => {
  // Blog body will be validated in mongoose model
  const blog = new Blog(request.body)
  blog.likes = blog.likes || 0

  // If await throws an error, the errorHandler middleware
  // will handle it and return 400 (see utils/middleware.js).
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogRouter