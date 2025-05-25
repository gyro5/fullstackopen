import { useState, useEffect } from 'react'
import db from './db'

const Filter = ({ fil, setFil }) => {
  const handleFilChange = (event) => {
    setFil(event.target.value)
  }
  return (
    <>
      filter shown with <input onChange={handleFilChange} value={fil} />
    </>
  )
}

const PersonForm = ({ addPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const onSubmit = (event) => {
    event.preventDefault()
    setNewName('')
    setNewNumber('')
    addPerson({ newName, newNumber })
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, fil, deletePerson }) => {
  const onClick = () => {
    if (window.confirm(`Delete ${p.name}?`)) {
      deletePerson(p.id)
    }
  }

  return (
    <>
      {persons.filter(p => p.name.toLowerCase().includes(fil.toLowerCase()))
        .map(p => (
          <p key={p.name}>
            {p.name} {p.number}
            <button onClick={onClick}>delete</button>
          </p>
        ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [fil, setFil] = useState('')

  const addPerson = ({ newName, newNumber }) => {
    let q = persons.find(p => p.name === newName)
    if (q) { // Existing person
      if (window.confirm(`${q.name} is already in phonebook, replace old number with new one?`)) {
        db.changePerson({ ...q, number: newNumber })
          .then(changedQ => setPersons(persons.map(p => p.id === q.id ? changedQ : p)))
      }
    }
    else { // New person
      db.addPerson(newName, newNumber)
        .then(p => {
          setPersons(persons.concat(p))
        })
    }
  }

  const deletePerson = (id) => {
    db.deletePerson(id).then(() => setPersons(persons.filter(p => p.id !== id)))
  }

  useEffect(() => {
    db.getAllPerson().then(ps => setPersons(ps))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter fil={fil} setFil={setFil} />

      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} fil={fil} deletePerson={deletePerson} />
    </div>
  )
}

export default App