const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response?.body?.forEach( blog => expect(blog.id).toBeDefined())
  response?.body?.forEach( blog => expect(blog._id).toBeUndefined())
})

test('a new blog can be added', async () => {
  const NewBlog = {
    title: 'Figma for Developers',
    author: 'Axda',
    url: 'http://localhost:3003/api/blogs/4',
    likes: 22
  }

  await api
    .post('/api/blogs')
    .send(NewBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Figma for Developers')
})

test('blog without likes property default to zero', async () => {
  const NewBlog = {
    title: 'Figma for Developers',
    author: 'Axda',
    url: 'http://localhost:3003/api/blogs/4'
  }

  await api
    .post('/api/blogs')
    .send(NewBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[response.body.length -1].likes).toBe(0)
})


afterAll(async () => {
  await mongoose.connection.close()
})