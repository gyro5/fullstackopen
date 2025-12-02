const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const testHelper = require('./testhelper')

const blogs = testHelper.initialBlogs

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const oneBlog = blogs[0]
    assert.strictEqual(listHelper.totalLikes([oneBlog]), oneBlog.likes)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog is that blog', () => {
    const oneBlog = blogs[0]
    assert.deepStrictEqual(listHelper.favoriteBlog([oneBlog]), oneBlog)
  })

  test('of a bigger list is the correct blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })
})

describe('most blogs author', () => {
  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })


  test('of a bigger list is the correct author', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes author', () => {
  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })


  test('of a bigger list is the correct author', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})