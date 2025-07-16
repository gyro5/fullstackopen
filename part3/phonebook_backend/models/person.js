const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

console.log('connecting to mongodb...')
mongoose.connect(url)
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log('error connecting to mongodb:', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: number => {
        // Use regex
        return /^\d{2}\d?-\d+$/.test(number)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: true
  }
})
personSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)