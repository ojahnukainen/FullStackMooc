const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request,response, next)=>{
  const users = await User.find({}).populate('blogs',{title: 1, url:1, likes:1})
  response.json(users)
})

usersRouter.post('/', async (request,response,next)=>{
  //const {name, username, password} = request.body
  const name = request.body.name
  const username = request.body.username
  const password = request.body.password
console.log(request.body, "nyt ollaa post menossa")
  console.log(username, "nimen pituus")
  console.log(password, "salakalan pituus")
  if(password.length < 3){
    return response.status(400).json({error: "Input has to be longer thatn 3 char"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try{
    const savedUser = await user.save()
    if(savedUser){
      response.status(201).json(savedUser).end()
    }else{
      response.status(404).end()
    }
    
  }catch(error){
    next(error)
  }
  
})

module.exports = usersRouter