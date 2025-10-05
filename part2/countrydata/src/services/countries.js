import axios from 'axios'
const countriesURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?'

const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY

const getAll = () => {
    const request = axios.get(countriesURL)
    return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const request = axios.get(weatherURL + `lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`)
    return request.then(response => response.data)
}

export default { getAll, getWeather }