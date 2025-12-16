const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const testHelper = require('./testhelper')
const User = require('../models/user')

const api = supertest(app)

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('fails when missing username or password', async () => {
    const missingUsername = {
      name: 'aaa',
      password: 'aaa'
    }

    const missingPassword = {
      name: 'aaa',
      username: 'aaa'
    }

    let res = await api
      .post('/api/users')
      .send(missingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, "Username and password must be present.")

    res = await api
      .post('/api/users')
      .send(missingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, "Username and password must be present.")

    const usersAtEnd = (await api.get('/api/users')).body
    assert.strictEqual(usersAtEnd.length, 0)
  })

  test('fails when username or password less than 3 characters', async () => {
    const shortUsername = {
      name: 'aaa',
      password: 'aaa',
      username: 'aa'
    }

    const shortPassword = {
      name: 'aaa',
      username: 'aaa',
      password: 'aa'
    }

    let res = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, "Username and password must be at least 3 characters long.")

    res = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, "Username and password must be at least 3 characters long.")

    const usersAtEnd = (await api.get('/api/users')).body
    assert.strictEqual(usersAtEnd.length, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})