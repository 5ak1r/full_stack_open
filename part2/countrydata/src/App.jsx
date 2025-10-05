import { useState, useEffect } from 'react'

import Search from './components/Search'
import Countries from './components/Countries'

import countryService from './services/countries'

const App = () => {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  
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
    const value = event.target.value
    setSearchValue(value)

    setFilteredCountries(value ? countries
      .filter(country => {
        const regex = new RegExp(value, 'i')
        return regex.test(country.name.common)
      }) : []
    )
  }

  const showCountry = index => {
    setFilteredCountries([filteredCountries[index]])
    setSearchValue(filteredCountries[index].name.common)
  }

  return (
  <div>
    <Search value={searchValue || ''} onChange={handleSearch} />
    <Countries countries={filteredCountries} onClick={showCountry}/>
  </div>
  )
}

export default App