import { useState, useEffect } from 'react'

import Search from './components/Search'
import Countries from './components/Countries'

import countryService from './services/countries'

const App = () => {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])
  
  useEffect(() => {
    countryService
      .getAll()
      .then(countries => setCountries(countries))
      .catch(() => {
        alert('Failed to fetch countries')
        return []
      })
  }, [])

  const handleSearch = (event) => {
    setSearchValue(event.target.value)
  }

  const filteredCountries = searchValue ? countries
    .filter(country => {
      const regex = new RegExp(searchValue, 'i')
      return regex.test(country.name.official)
    }) : null

  return (
  <div>
    <Search onChange={handleSearch} />
    <Countries countries={filteredCountries} />
  </div>
  )
}

export default App