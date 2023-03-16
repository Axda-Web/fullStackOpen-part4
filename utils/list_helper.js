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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}