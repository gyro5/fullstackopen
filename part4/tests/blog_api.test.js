const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')

const app = require('../app')
const testHelper = require('./testhelper')

const api = supertest(app)

describe('when there is initially some blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testHelper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, testHelper.initialBlogs.length)
  })

  test('the identifier of each blog is "id"', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.ok(!blog._id)
    })
  })

  describe('creating a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "Test title",
        author: "Test author",
        url: "Test url",
        likes: 10
      }

      const addedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      for (const field in newBlog) {
        assert.strictEqual(addedBlog.body[field], newBlog[field])
      }

      // Check that the number of blogs is increased by 1
      const res = await api.get('/api/blogs')
      const blogs = res.body
      assert.strictEqual(blogs.length, testHelper.initialBlogs.length + 1)

      // Check that the new blogs is indeed included
      const containNewBlog = blogs.map(b => (
        b.title === newBlog.title &&
        b.author === newBlog.author &&
        b.url === newBlog.url &&
        b.likes === newBlog.likes &&
        b.id === addedBlog.body.id
      )).reduce((acc, ele) => acc || ele, false)
      assert(containNewBlog)
    })

    test('succeeds with default likes value of 0', async () => {
      const newBlog = {
        title: "Test title",
        author: "Test author",
        url: "Test url",
      }

      const addedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const res = await api.get('/api/blogs')
      const blogs = res.body
      assert.strictEqual(blogs.length, testHelper.initialBlogs.length + 1)

      // Check that the new blogs is indeed included
      const containNewBlog = blogs.map(b => (
        b.likes === 0 &&
        b.id === addedBlog.body.id
      )).reduce((acc, ele) => acc || ele, false)
      assert(containNewBlog)
    })

    test('fails with status code 400 if missing url or title', async () => {
      // Missing title
      const newBlog1 = {
        author: "Test author",
        url: "Test url",
        likes: 10
      }
      await api.post('/api/blogs').send(newBlog1).expect(400)
      const blogsAtEnd = (await api.get('/api/blogs')).body
      assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length)

      // Missing url
      const newBlog2 = {
        title: "Test title",
        author: "Test author",
        likes: 10
      }
      await api.post('/api/blogs').send(newBlog2).expect(400)
      const blogsAtEnd2 = (await api.get('/api/blogs')).body
      assert.strictEqual(blogsAtEnd2.length, testHelper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})