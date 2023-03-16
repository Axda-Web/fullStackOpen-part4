const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  return blogs.length ? blogs.map(blog => blog.likes).reduce((current, total) => current + total) : 0
}

module.exports = {
  dummy,
  totalLikes
}