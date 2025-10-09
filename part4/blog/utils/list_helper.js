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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}