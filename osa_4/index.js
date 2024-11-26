const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

//middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const rndIDNumber = () => {
  const id = Math.floor(Math.random() * 9000)
  return String(id)
}

app.get('/api/blogs', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      if(blogs)
        {response.json(blogs)}
      else
        {response.status(404).end()}
      })
    .catch(error => {
      next(error)
    })
})

app.post('/api/blogs', (request, response,next ) => {
  const body = request.body

  if(!body.title || !body.url){
    return response.status(404).json({
      error: 'Content missing',
      body: body
    })
  }  
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: rndIDNumber(),
  })

  newBlog
    .save()
    .then(result => {
      if(result){
        response.status(201).json(result)}
      else{
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})