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

blogRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  let blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).end()
  }

  blog.title = body.title || blog.title
  blog.author = body.author || blog.author
  blog.url = body.url || blog.url
  blog.likes = body.likes

  response.json(await blog.save())
})

module.exports = blogRouter