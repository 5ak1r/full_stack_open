const assert = require('node:assert')
const {test, after, beforeEach} = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'The Third Blog',
    author:'The Third Author',
    url: 'the.third.url',
    likes: 1000
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

test('blog without title is not added', async () => {
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

test('blog without author is not added', async () => {
  const newBlog = {
    title: 'The Fifth Blog',
    url: 'the.fifth.url',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
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

test('blog without likes is defaulted to 0', async () => {
  const newBlog = {
    title: 'The Seventh Blog',
    author: 'The Seventh Author',
    url: 'the.seventh.url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.at(-1).likes, 0)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

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

after(async () => {
  await mongoose.connection.close()
})