const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

const rndIDNumber = () => {
  const id = Math.floor(Math.random() * 9000)
  return String(id)
}

blogsRouter.get('/', (request, response, next) => {
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

blogsRouter.post('/', (request, response, next ) => {
  const body = request.body
  logger.info(body)
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

module.exports = blogsRouter