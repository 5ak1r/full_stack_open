const Person = ({ person, handleDelete }) => {
  return (
    <p>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>
  )
}

const Persons = ({ persons, filterValue, handleDelete }) => {
  return (
    persons
      .filter(person => {
        const regex = new RegExp(filterValue, 'i')
        return regex.test(person.name)
      })
      .map(person => <Person key={person.id} person={person} handleDelete={handleDelete}/>)
  )
}

export default Persons