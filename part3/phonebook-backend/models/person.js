const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be at least 3 characters long'],
    required: [true, 'name is required']
  },
  number: {
    type: String,
    minLength: [8, 'phone number must be at least 8 characters long'],
    validate: {
      validator: v => {
        return /^(?:\d{2}-\d+|\d{3}-\d+)$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)