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
  const { name, number } = request.body

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
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

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

  Person.findOne({name: body.name})
    .then(existingPerson => {
      if(existingPerson) {
        return response.status(400).json ({
          error: 'name must be unique'
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })
      
      return person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})