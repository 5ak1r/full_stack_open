const Country = ({ country }) => {
  return(
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>

      <h1>Languages</h1>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => (
          <li key={code}>
            {name}
          </li>
        ))}
      </ul>

      <h1>Flag</h1>
      <img src={country.flags.png} />
    </div>
  )
}

const CountryName = ({ name, onClick, index }) => {
  return (
    <div>
      {name} <button onClick={() => onClick(index)}>show</button>
    </div>
  )
}

const Countries = ({ countries, onClick }) => {

  if(!countries || countries.length > 10) {
    return (
      <div>
        please be more specific
      </div>
    )
  }

  if(countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return countries.map((country, index) => (
    <CountryName
      key={index}
      name={country.name.common}
      onClick={onClick}
      index={index}
    />
  ))
}

export default Countries