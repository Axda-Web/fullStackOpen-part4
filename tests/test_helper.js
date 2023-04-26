const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'JS Promises masterclass',
    author: 'Axda',
    url: 'http://localhost:3003/api/blogs/1',
    likes: 13
  },
  {
    title: 'Master Regex',
    author: 'Axda',
    url: 'http://localhost:3003/api/blogs/2',
    likes: 7
  },
  {
    title: 'Styling with Tailwindcss',
    author: 'Axda',
    url: 'http://localhost:3003/api/blogs/3',
    likes: 45
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
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
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}