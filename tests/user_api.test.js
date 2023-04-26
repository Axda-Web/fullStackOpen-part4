const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a valid user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation failed with an invalid user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'user1',
      name: 'Test User 1',
    }

    const newUser2 = {
      username: 'user2',
      name: 'Test User 2',
      password: 'no'
    }

    const response1 = await api
      .post('/api/users')
      .send(newUser1)

    expect(response1.status).toBe(400)

    const response2 = await api
      .post('/api/users')
      .send(newUser2)

    expect(response1.status).toBe(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser1.username)
    expect(usernames).not.toContain(newUser2.username)

    expect(response1.body.message).toContain('Missing Ursername or Password')
    expect(response2.body.message).toContain('Username and Password must contains at least 3 characters')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})