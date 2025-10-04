const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const Persons = ({ persons, filterValue }) => {
  return (
    persons
      .filter(person => {
        const regex = new RegExp(filterValue, 'i')
        return regex.test(person.name)
      })
      .map(person => <Person key={person.id} person={person} />)
  )
}

export default Persons