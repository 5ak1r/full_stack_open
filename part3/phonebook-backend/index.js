require('dotenv').config()

const express = require('express')
const morgan  = require('morgan')
const mongoose = require('mongoose')

const Person = require('./models/person')
const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.static('dist'))

//creating our own middleware
/*const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)*/

app.use(morgan(
    'tiny',
    { skip: (request, response) => { return request.method === 'POST'}}
  )
)

morgan.token('data', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :data',
    { skip: (request, response) => { return request.method !== 'POST' } }
  )
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

/*app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if(!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if(!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.find({name: body.name}).then(() => {
    return response.status(400).json ({
      error: 'name must be unique'
    })
  })
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/info', (request, response) => {
  const time = new Date()
  response.send(`
    <p>Phonebook has info for 2 people</p>
    <p>${time}</p>
  `)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})