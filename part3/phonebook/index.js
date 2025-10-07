const express = require('express')
const morgan  = require('morgan')

const app = express()

app.use(express.json())

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

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
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

  if(phonebook.find(person => person.name === body.name)) {
    return response.status(400).json ({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number || false,
    id: String(Math.floor(Math.random() * 1e9)),
  }
  
  phonebook = phonebook.concat(person)

  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const time = new Date()
  response.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${time}
    `)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})