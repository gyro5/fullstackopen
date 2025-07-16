const mongoose = require('mongoose')
const { argv, exit } = require('node:process')

// Check command line args
if (argv.length !== 3 && argv.length !== 5) {
  console.log('error: require 1 or 3 argument, got', argv.length)
  exit(1)
}

const passwd = argv[2]
const url = `mongodb+srv://kkid107:${passwd}@cluster0.hk2ta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

// Get
if (argv.length === 3) {
  Person.find({})
    .then(people => {
      if (people) {
        console.log('phonebook:')
        for (let p of people) {
          console.log(`${p.name} ${p.number}`)
        }
      }
      mongoose.connection.close()
      exit(0)
    })
}

// Add
if (argv.length === 5) {
  const name = argv[3]
  const number = argv[4]
  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save()
    .then(savedPerson => {
      if (savedPerson) {
        console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
      }
      mongoose.connection.close()
      exit(0)
    })
}