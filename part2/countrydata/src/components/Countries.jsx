import { useState, useEffect } from 'react'
import weatherService from '../services/countries'

const Country = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [lat, lon] = country.latlng

  useEffect(() => {
    weatherService
      .getWeather(lat, lon)
      .then(weather => setWeatherInfo(weather))
      .catch(() => {
        alert('Failed to fetch weather')
        setWeatherInfo(null)
      })
  }, [lat, lon])

  const icon = weatherInfo?.weather?.[0]?.icon

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

      <h1>Weather</h1>
      <div>Temperature: {weatherInfo?.main?.temp} Celsius</div>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <div>Wind: {weatherInfo?.wind?.speed} m/s</div>
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