const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'Invalid request data', message: 'Missing blog title or url' })
  }

  const user = request.user
  const blog = new Blog({ likes: 0, ...request.body, user: user.id })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (user._id.toString() === blogToDelete.user.toString()) {
    const removedBlog = await Blog.findByIdAndRemove(request.params.id)
    user.blogs = user.blogs.filter(blog => blog.id !== removedBlog._id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Not allowed', message: 'You are not authorized to delete this item' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user
  const blogToUpdate = await Blog.findById(request.params.id)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  if (user._id.toString() === blogToUpdate.user.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } else {
    return response.status(401).json({ error: 'Not allowed', message: 'You are not authorized to update this item' })
  }
})

module.exports = blogsRouter