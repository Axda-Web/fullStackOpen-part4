const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Get the blogs', () => {
  test('blogs are returned as json', async () => {

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique blog identifier is named id', async () => {
    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)

    response?.body?.forEach( blog => expect(blog.id).toBeDefined())
    response?.body?.forEach( blog => expect(blog._id).toBeUndefined())
  })
})


describe('Post a new blog', () => {
  test('a new blog can be added', async () => {
    const NewBlog = {
      title: 'Figma for Developers',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/4',
      likes: 22
    }

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(NewBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)

    const titles = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Figma for Developers')
  })

  test('Return 401 error if no valid token is provided', async () => {
    const NewBlog = {
      title: 'Figma for Developers',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/4',
      likes: 22
    }

    await api
      .post('/api/blogs')
      .send(NewBlog)
      .expect(401)

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)

    const titles = response.body.map(blog => blog.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
    expect(titles).not.toContain('Figma for Developers')
  })

  test('blog without likes property default to zero', async () => {
    const NewBlog = {
      title: 'Figma for Developers',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/4'
    }

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(NewBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)

    expect(response.body[response.body.length -1].likes).toBe(0)
  })

  test('return 400 error if title or url property are missing', async () => {
    const NewBlog1 = {
      title: 'What is the Jamstack',
      author: 'Axda',
      likes: 73
    }

    const NewBlog2 = {
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/5',
      likes: 73
    }

    const NewBlog3 = {
      author: 'Axda',
      likes: 73
    }

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response1 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(NewBlog1)

    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(NewBlog2)

    const response3 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(NewBlog3)

    expect(response1.status).toBe(400)
    expect(response1.body.message).toBe('Missing blog title or url')

    expect(response2.status).toBe(400)
    expect(response2.body.message).toBe('Missing blog title or url')

    expect(response3.status).toBe(400)
    expect(response3.body.message).toBe('Missing blog title or url')
  })
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToDelete = blogAtStart[0]

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update a specific blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const modifiedBlog = {
      title: 'JS Promises masterclass',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/1',
      likes: 1111
    }

    const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(modifiedBlog)

    expect(response.body.likes).toBe(1111)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes).toContain(modifiedBlog.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})