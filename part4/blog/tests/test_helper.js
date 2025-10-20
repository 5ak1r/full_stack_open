const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'The First Blog',
    author: 'The First Author',
    url: 'the.first.url',
    likes: 1000,
    userId: '63e213f1231b'
  },
  {
    title: 'The Second Blog',
    author: 'The Second Author',
    url: 'the.second.url',
    likes: 1000,
    userId: '63e213f1231b'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'The Next Blog',
    author: 'The Next Author',
    url: 'the.next.url',
    likes: 5,
    userId: '63e213f1231b'
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}