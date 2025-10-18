const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, o) => acc + o.likes, 0)
}

const favouriteBlog = blogs => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog: max
    }, blogs[0])
}

const mostBlogs = blogs => {
  if(blogs.length === 0) return {}

  const groupAuthors = _.groupBy(blogs, 'author')
  const mostAuthor = _.maxBy(Object.keys(groupAuthors), author => groupAuthors[author].length)

  return {
    author: mostAuthor,
    blogs: groupAuthors[mostAuthor].length
  }
}

const mostLikes = blogs => {
  if(blogs.length === 0) return {}

  const groupAuthors = _.groupBy(blogs, 'author')
  const totalLikes = _.map(groupAuthors, (blog, author) => ({
    author,
    likes: _.sumBy(blog, 'likes')
  }))

  return _.maxBy(totalLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}