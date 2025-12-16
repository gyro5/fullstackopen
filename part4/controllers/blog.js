const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Router for '/api/blogs' route

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  // Blog body will be validated in mongoose model
  const blog = new Blog(request.body)
  blog.likes = blog.likes || 0

  // TODO will change id to jwt later
  const user = await User.find({})
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  blog.user = user._id
  // If await throws an error, the errorHandler middleware
  // will handle it and return 400 (see utils/middleware.js).
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

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