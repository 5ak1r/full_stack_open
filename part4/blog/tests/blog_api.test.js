const assert = require('node:assert')
const {test, describe, after, beforeEach} = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

let userId

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()

    userId = user._id
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'riko',
      name: 'Robert Iko',
      password: 'Baguette123!'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

describe('when there are already blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    //foreach does not work correctly with await/async as it expects synchronous functions as its parameter
    //Promise.all executes the promises received in parallel; problematic if it needs to be a specific order
    //so we can use a for...of loop instead
    //however there is a built in mongoose method, insertMany that we can use for an even easier solution
    await Blog.insertMany(helper.initialBlogs)
  })

  test('unique identifier is called id and not _id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blog = blogsAtStart[0]

    assert.ok(Object.prototype.hasOwnProperty.call(blog, 'id'))
    assert.ok(!Object.prototype.hasOwnProperty.call(blog, '_id'))
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const urls = response.body.map(e => e.url)
    assert(urls.includes('the.second.url'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()
      await api.get(`/api/blogs/${validNonExistingId}`).expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'The Third Blog',
        author:'The Third Author',
        url: 'the.third.url',
        likes: 1000,
        userId: userId
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const urls = blogsAtEnd.map(b => b.url)
      assert(urls.includes('the.third.url'))
    })

    test('fails without title', async () => {
      const newBlog = {
        author: 'The Fourth Author',
        url: 'the.fourth.url',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails without author', async () => {
      const newBlog = {
        title: 'The Fifth Blog',
        url: 'the.fifth.url',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails without url', async () => {
      const newBlog = {
        title: 'The Sixth Blog',
        author: 'The Sixth Author',
        likes: 23
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('succeeds without likes; defaults to 0', async () => {
      const newBlog = {
        title: 'The Seventh Blog',
        author: 'The Seventh Author',
        url: 'the.seventh.url',
        userId: userId
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.at(-1).likes, 0)
    })
  })

  describe('deletion of a note', async () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const urls = blogsAtEnd.map(b => b.url)
      assert(!urls.includes(blogToDelete.url))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})