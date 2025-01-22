//middleware
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  console.log(error.name, "tää osuus tulee middlewares errirHandelistä")
 
  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  } 

  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  console.log("iäm in token exrractor")
  try{
    const authorization = request.get('authorization')
    console.log(authorization)
    
    if (authorization && authorization.startsWith('Bearer ')) {
      console.log("kaikki reilassa")
      request.token = authorization.replace('Bearer ', '')
      //console.log(request, "tää tulee tokenista")
    }
    next()
  } catch(error){
    next(error)
  }
 
}

const userExtractor = async (request, response, next) => {
  
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id)
    next()
  }
  catch(error){
    next(error)
  }
 

 

}
module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}