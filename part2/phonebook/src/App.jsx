import { useState } from 'react'

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

const Persons = ({persons, fil}) => {
  return (
    <>
      {persons.filter(p => p.name.toLowerCase().includes(fil.toLowerCase()))
        .map(p => <p key={p.name}>{p.name} {p.number}</p>)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '39-44-5654533' }
  ])

  const [fil, setFil] = useState('')

  const addPerson = ({ newName, newNumber }) => {
    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter fil={fil} setFil={setFil} />

      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} fil={fil} />
    </div>
  )
}

export default App