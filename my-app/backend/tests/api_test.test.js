const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./api_test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('DATABASE tests', () => {
  test('there are three posts', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('API tests', () => {
  describe('GET tests', () => {
    test('right amount of posts', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('response is in json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  
    test('first posts title is correct', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(post => post.title)
      assert.strictEqual(titles[0], helper.initialBlogs[0].title)
    })
  
    test('bodys id is in right format', async () => {
      const response = await api.get('/api/blogs')
      const keys = Object.keys(response.body[0])
      assert(!keys.includes('_id'))
    })
  })

  describe('POST tests', () => {
    test('valid post can be added', async () => {
      const newBlog = {
        title: "api_test_valid_post",
        author: "valid ASD",
        url: "apitest.test",
        likes: "30"
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const titles = response.body.map(post => post.title)
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(titles.includes('api_test_valid_post'))
    })
  
    test('0 added if no likes specified', async () => {
      const newBlog = {
        title: "api_test_nolikes_post",
        author: "nolikes ASD",
        url: "apitest.test"
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const lastElement = response.body[response.body.length - 1]
      assert.strictEqual(lastElement.likes, 0)
    })
  
    test('no title field returns 400', async () => {
      const newBlog = {
        author: "nolikes ASD",
        url: "apitest.test",
        likes: 123
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  
    test('no URL field returns 400', async () => {
      const newBlog = {
        author: "nolikes ASD",
        title: "valid title",
        likes: 123
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('PUT tests', () => {
    test('updating likes of latest post works', async () => {
      const responseBefore = await api.get('/api/blogs')
      const lastPostBefore = responseBefore.body[responseBefore.body.length - 1]
      const body = {
        likes: 1000
      }
      await api
        .put(`/api/blogs/${lastPostBefore.id}`)
        .send(body)
        .expect(201)
      const responseAfter = await api.get(`/api/blogs/`)
      const lastPostAfter = responseAfter.body[responseAfter.body.length - 1]
      assert.notStrictEqual(lastPostAfter.likes, lastPostBefore.likes)
    })

    test('updating nonexistent id returns 404', async () => {
      const nonexistentId = '667d9a33a4e51b85fe816340'
      const body = {
        likes: 1000
      }
      await api
        .put(`/api/blogs/${nonexistentId}`)
        .send(body)
        .expect(404)
    })

    test('invalid id returns 400', async () => {
      const invalidId = '123qwe456asd'
      const body = {
        likes: 1000
      }
      await api
        .put(`/api/blogs/${invalidId}`)
        .send(body)
        .expect(400)
    })
  })

  describe('DELETE tests', () => {
    test('delete by VALID id returns 204', async () => {
      const validId = '667d892b8950abec0362b045'
      await api
        .delete(`/api/blogs/${validId}`)
        .expect(204)
    })

    test('delete by INVALID id returns 400', async () => {
      const invalidId = '123qwe456asd'
      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })

    test('last blog is actually deleted', async () => {
      const responseBefore = await api.get('/api/blogs')
      const lastId = responseBefore.body[responseBefore.body.length - 1].id
      await api.delete(`/api/blogs/${lastId}`)
      const responseAfter = await api.get('/api/blogs')
      const ids = responseAfter.body.map(post => post.id)
      assert(!ids.includes(lastId))
    })
  })
})

describe('USERS tests', () => {
  test('user can be created', async () => {
    const newUser = {
      username: "new_user",
      name: "New User",
      password: "new_user_password"
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body[response.body.length - 1].username, 'new_user')
  })

  test('INVALID USERNAME is not accepted', async () => {
    const invalidUser = {
      username: "xx",
      name: "New User",
      password: "new_user_password"
    }
    let responseError = ''
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        responseError = response.body.error
      })
      assert(responseError.includes('User validation failed: username:'))
    })

  test('INVALID PASSWORD is not accepted', async () => {
    const invalidPass = {
      username: "new_user",
      name: "New User",
      password: "xx"
    }
    await api
      .post('/api/users')
      .send(invalidPass)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'password must be atleast 3 characters long'})
  })

  test('duplicate username cannot be created', async () => {
    const duplicateUser = helper.initialUsers[0]
    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'expected `username` to be unique'})
  })
})

after(async () => {
  await mongoose.connection.close()
})
