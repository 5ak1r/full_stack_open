const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'The First Blog',
    author: 'The First Author',
    url: 'the.first.url',
    likes: 1000
  },
  {
    title: 'The Second Blog',
    author: 'The Second Author',
    url: 'the.second.url',
    likes: 1000
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'The Next Blog',
    author: 'The Next Author',
    url: 'the.next.url',
    likes: 5
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}