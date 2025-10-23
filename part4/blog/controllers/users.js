const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {user: 0})

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  if(!username || !password || username.length < 3 || password.length < 3) {
    return response.status(401).json({
      error: 'invalid username or password format'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter