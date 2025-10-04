import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [filterValue, setFilterValue] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterValue(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if(newName === '' || newNumber === '') {
      alert(`Please fill in all parts of the form`)
      return
    }

    if(persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter onChange={handleFilter} />

      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange} numberValue={newNumber} numberOnChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons persons={persons} filterValue={filterValue} />

    </div>
  )
}

export default App