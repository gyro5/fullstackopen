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
  const handleDelete = (p) => {
    if (window.confirm(`Delete ${p.name}?`)) {
      deletePerson(p)
    }
  }

  return (
    <>
      {persons.filter(p => p.name.toLowerCase().includes(fil.toLowerCase()))
        .map(p => (
          <p key={p.name}>
            {p.name} {p.number}
            <button onClick={() => handleDelete(p)}>delete</button>
          </p>
        ))}
    </>
  )
}

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={isError ? "error" : "noti"}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [fil, setFil] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notiMessage, setNotiMessage] = useState(null)

  const addPerson = ({ newName, newNumber }) => {
    let q = persons.find(p => p.name === newName)
    if (q) { // Existing person
      if (window.confirm(`${q.name} is already in phonebook, replace old number with new one?`)) {
        db.changePerson({ ...q, number: newNumber })
          .then(changedQ => {
            setPersons(persons.map(p => p.id === q.id ? changedQ : p))
            setNotiMessage(`Changed the phone number of ${q.name}`)
            setTimeout(() => { setNotiMessage(null) }, 5000)
          })
          .catch(err => {
            setErrorMessage(err.response.data.error)
            setTimeout(() => { setErrorMessage(null) }, 5000)
          })
      }
    }
    else { // New person
      db.addPerson(newName, newNumber)
        .then(p => {
          setPersons(persons.concat(p))
          setNotiMessage(`Added ${p.name}`)
          setTimeout(() => { setNotiMessage(null) }, 5000)
        })
        .catch(err => {
          setErrorMessage(err.response.data.error)
          setTimeout(() => { setErrorMessage(null) }, 5000)
        })
    }
  }

  const deletePerson = (p) => {
    db.deletePerson(p.id)
      .then(() => setPersons(persons.filter(person => person.id !== p.id)))
      .catch(() => {
        setErrorMessage(`Information of '${p.name}' has been already removed from server`)
        setPersons(persons.filter(person => person.id !== p.id))
        setTimeout(() => { setErrorMessage(null) }, 5000)
      })
  }

  useEffect(() => {
    db.getAllPerson().then(ps => setPersons(ps))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} isError={true} />
      <Notification message={notiMessage} isError={false} />
      <Filter fil={fil} setFil={setFil} />

      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} fil={fil} deletePerson={deletePerson} />
    </div>
  )
}

export default App