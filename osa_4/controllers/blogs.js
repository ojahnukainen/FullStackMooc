const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  
  try{
    if(blogs)
      {response.json(blogs)}
    else
      {response.status(404).end()}
   }
    catch(error) {
      next(error)
    }   
})

blogsRouter.post('/', async (request, response, next ) => {
  const body = request.body
  logger.info(body)
  if(!body.title || !body.url){
    return response.status(400).json({
      error: 'Content missing',
      body: body
    })
  }  
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })
  console.log(newBlog)
  try{
    const savedBlog = await newBlog.save()
    if(savedBlog){
      response.status(201).json(savedBlog)}
    else{
      response.status(404).end()
    }
  } catch(expectations){
    next(expectations)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
 try{
  const deleteBlog = await Blog.findByIdAndDelete(request.params.id)
    if(deleteBlog){
      response.status(204).end()
    }else{
      response.status(404).end()
    }
 }catch(error){
    next(error)
 }
})

blogsRouter.put('/:id', async (request, response, next)=>{
  const body = request.body
  const count = body.likes +1

  const blogUpdate = {
    likes: count
  }
   
  try{
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogUpdate, {new: true})
    if(updatedBlog){
      response.status(200).json(blogUpdate).end()
    }else{
      response.status(204).end()
    }
  }catch(error){
    next(error)
  }
})

module.exports = blogsRouter