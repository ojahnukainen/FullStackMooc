//middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.name, "tää osuus tulee middlewares errirHandelistä")
 
  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  unknownEndpoint
}