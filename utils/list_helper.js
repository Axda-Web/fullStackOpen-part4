const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  return blogs.length ? blogs.map(blog => blog.likes).reduce((current, total) => current + total) : 0
}

const favoriteBlog = blogs => {
  const sortedBlogs = blogs.map(blog => ({ title: blog.title, author: blog.author, likes: blog.likes })).sort((a, b) => b.likes - a.likes)
  return blogs.length ? sortedBlogs[0] : 'There is no blog yet'
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return 'There is no blog yet'
  }

  const blogCounts = _.countBy(blogs, 'author')

  const authorWithMostBlogs = _.maxBy(_.toPairs(blogCounts), pair => pair[1])

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}