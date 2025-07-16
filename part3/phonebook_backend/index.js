require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// Morgan logger middleware
app.use(morgan((tokens, req, res) => {
  let fields = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (req.method === 'POST') {
    fields.push(JSON.stringify(req.body))
  }
  return fields.join(' ')
}))
app.use(express.json())

// Static React frontend
app.use(express.static('dist'))

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<div>Phonebook has info for ${count} people</div>
        <div>${new Date(Date.now()).toString()}</div>`
      )
    })

})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(people => res.json(people))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      return res.json(person)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  // IMPORTANT: need return to stop doing more response after errors
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).send({ error: "missing name or number" })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(err => next((err)))
})

app.put('/api/persons/:id', (req, res, next) => {
  if (!req.body.number) {
    return res.status(400).send({ error: "missing number" })
  }

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.number = req.body.number
      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}
// Error handler NEEDS to be the last loaded middleware
app.use(errorHandler)

// Run the app
const PORT = 3001
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}/api/persons`)
})