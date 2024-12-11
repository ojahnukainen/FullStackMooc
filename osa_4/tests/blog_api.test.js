const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () =>{
  await Blog.deleteMany({})

  for(let element of helper.initialBlogs) {
    let blogObject = new Blog(element)
    await blogObject.save()
  }
})

test('blog entrys are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs at the db', async () =>{
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog ohjects contains correct type id', async () =>{
  const response = await api.get('/api/blogs')
  const content = Object.keys(response.body[0])
 
  assert(content.includes("id"))
})

test('add new valid blog to db', async () =>{
  const newBlog = {
    title: "Vue patterns",
    author: "Eric Chan",
    url: "https://vuepatterns.com/",
    likes: 23
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.url)

  assert.strictEqual(response.body.length, helper.initialBlogs.length +1)
  assert(contents.includes("https://vuepatterns.com/"))
})

test('add blog without likes and app fills it to be zero', async () =>{
  const newBlog = {
    title: "Vue patterns",
    author: "Eric Chan",
    url: "https://vuepatterns.com/"
  }
  const expecteLikesCount = {
    title: "Vue patterns",
    author: "Eric Chan",
    url: "https://vuepatterns.com/",
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const content = response.body.pop()
  
  assert(content, expecteLikesCount)
})

test('Return 400 if title or url missing from the post', async () =>{
  const newBlogNoTitle = {
    author: "Eric Chan",
    url: "https://vuepatterns.com/",
    likes: 23
  }
  const newBlogNoUrl = {
    title: "Vue patterns",
    author: "Eric Chan",
    likes: 23
  }
  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    await api
    .post('/api/blogs')
    .send(newBlogNoUrl)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Delete blog from db', async () =>{
  const response = await api.get('/api/blogs')
  const id = response.body[0].id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const responseAfterDelete = await api.get('/api/blogs')
  assert.strictEqual(responseAfterDelete.body.length, helper.initialBlogs.length -1)
})

test.only('Update blog likes', async () =>{
  const response = await api.get('/api/blogs')
  const id = response.body[0].id
  const likes = response.body[0].likes
  console.log(response.body[0].likes, "liket ennen")
  console.log(likes, "liket tulilla")
  await api
    .put(`/api/blogs/${id}`)
    .send({likes: likes})
    .expect(200)

  const responseAfterUpdate = await api.get('/api/blogs')
  const content = responseAfterUpdate.body[0].likes

  console.log(content, "liket jälkeen")
  assert.strictEqual(content, likes+1)
})

after(async () => {
  await mongoose.connection.close()
})