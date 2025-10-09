import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  // effect hook to retrieve data from json server. [] is when to run this again (only ever do it on the first render)
  useEffect(() => {
    updatePersons()
  }, [])

  // update persons array using json server
  const updatePersons = () => {
    personService
      .getAll()
      .then(updatedPersons => {
        setPersons(updatedPersons)
      })
      .catch(() => {
        createNotification('Failed to fetch the latest persons', 'error')
        return []
      })
  }

  // create a notification popup on success or error
  const createNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  // keep event handling in App.jsx
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterValue(event.target.value)
  }

  const handleDelete = (id) => {
    if(confirm(`Are you sure you want to delete ${persons.find(person => person.id === id).name}`)) {
      personService
        .remove(id)
        .then(() => updatePersons())
        .catch(() => {
          createNotification('This person was already deleted', 'error')
          updatePersons()
        })
    }

    return true
  }

  // add a new person to phonebook
  const addPerson = (event) => {
    event.preventDefault()

    // ensure all values are filled in
    if(!newName || !newNumber) {
      createNotification('Please fill in all parts of the form', 'error')
      return
    }

    personService
      .getAll()
      .then(latestPersons => {
        const existingPerson = latestPersons.find(person => person.name === newName)

        // update phone number option if name already exists
        if(existingPerson) {
          if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
            personService
              .update(existingPerson.id, { name: newName, number: newNumber })
              .then(() => updatePersons())
              .then(() => {
                createNotification(`${newName} number has been updated successfully`, 'success')
                setNewName('')
                setNewNumber('')
              })
              .catch(() => {
                createNotification(`${newName} no longer exists in the phonebook`, 'error')
                updatePersons()
              })
          }
        }
        else {
          const personObject = {
            name: newName,
            number: newNumber
          }

          personService
            .create(personObject)
            .then(() => updatePersons())
            .then(() => {
              createNotification(`Successfully added ${newName}`, 'success')
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              createNotification(error.response.data.error)
            })
        }
      })
      .catch(error => {
        createNotification(error.response.data.error)
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notificationMessage} type={notificationType}/>
      <Filter onChange={handleFilter} />
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
      />
      
      <h1>Numbers</h1>

      <Persons
        persons={persons}
        filterValue={filterValue}
        handleDelete={handleDelete}
      />

    </div>
  )
}

export default App