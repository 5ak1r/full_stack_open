require('dotenv').config()

const express = require('express')
const morgan  = require('morgan')

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
  {skip: (request) => { return request.method === 'POST'}}
))

morgan.token('data', (req) => { return JSON.stringify(req.body) })

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data',
  {skip: (request) => { return request.method !== 'POST' }}
))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const time = new Date()
  let num = 0

  Person.countDocuments({})
    .then(count => {
      num = count
    })
    .catch(error => next(error))

  response.send(`
    <p>Phonebook has info for ${num} people</p>
    <p>${time}</p>
  `)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})