const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const { tokenExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1})
  
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
  console.log(request, "blogs roter tokens")
  const user = request.user
  try{
  if(!tokenExtractor){
    return response.status(401).json({error: "unauthorised to post"})
  }

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
    user: user._id
  })
  console.log(newBlog)
  
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    if(savedBlog){
      response.status(201).json(savedBlog).end()}
    else{
      response.status(404).end()
    }
  } catch(expectations){
    next(expectations)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
 try{
  console.log(request.params,"delete requeser")
  const blog = await Blog.findById(request.params.id)
  const userId = request.user.id
  console.log(blog,"deleten blog olio")
  if(blog.user.toString() === userId.toString()){
    const deleteBlog = await Blog.findByIdAndDelete(request.params.id)
    if(deleteBlog){
      response.status(204).end()
    }else{
      response.status(404).end()
    }
  } else{
    response.status(401).json({
      error: 'invalid token or user id'
    })
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