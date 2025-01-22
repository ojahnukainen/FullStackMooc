const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper.test')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () =>{
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret',10)
    const user = new User({username: 'root', passwordHash})
    
    await user.save()
  })
 
  test('creation succeeds with a fresh username', async () =>{
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Kissakala',
      name: 'Kissa Kalanen',
      password: 'salakala',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      console.log(usersAtEnd, "onko täällä uusi")
      assert.strictEqual(usersAtEnd.length, userAtStart.length+1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const userAtStart = await helper.usersInDb()
    console.log(userAtStart, "se failure kohta")
    const newUser = {
      username: 'root',
      password: 'salakala',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    console.log(result, "tääkö on tyhjö")
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, userAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb() 

    const newFailUsername = {
      username: 'Bo',
      name:'Bo Kaspers',
      password: 'bööö'
    }

    const result = await api
      .post('/api/users')
      .send(newFailUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    
    assert(result.body.error.includes('shorter than the minimum allowed length (3)'))
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

  after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })