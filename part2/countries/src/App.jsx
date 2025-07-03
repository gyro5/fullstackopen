import { useState, useEffect } from 'react'
import db from './db'
import wt from './weather'

const Filter = ({ label, fil, onChange }) => {
  return (
    <>
      {label}
      <input onChange={onChange} value={fil} />
    </>)
}

const Country = ({country: c}) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    // console.log("effect used")
    wt.getWeather(c.capitalInfo.latlng[0], c.capitalInfo.latlng[1])
    .then(res => setWeather(res))
  }, [])

  return (
    <>
      <h1>{c.name.common}</h1>
      <div>Capital {c.capital[0]}</div>
      <div>Area {c.area}</div>

      <h2>Languages</h2>
      <ul>{Object.keys(c.languages).map(k =>
        <li key={c.languages[k]}>{c.languages[k]}</li>)}</ul>
      <img src={c.flags.png}/>

      <h2>Weather in {c.capital[0]}</h2>
      {
        weather ?
        (
          <>
            <div>Temperature {weather.current.temperature_2m} {weather.current_units.temperature_2m}</div>
            <img src={wt.getWeatherIconURL(weather.current.weather_code)} />
            <div>Wind {weather.current.wind_speed_10m	} {weather.current_units.wind_speed_10m	}</div>
          </>
        )
        : ""
      }
    </>
  )
}

const App = () => {
  const [fil, setFil] = useState('')
  const [countries, setCountries] = useState([])
  const [one, setOne] = useState(null)

  useEffect(() => {
    db.getAllCountries().then(res => setCountries(res))
  }, [])

  const handleFilChange = (event) => {
    setOne(null)
    setFil(event.target.value)
  }

  let filteredCountries = countries.filter(
    c => {
      let f = fil.toLowerCase();
      return c.name.common.toLowerCase().includes(f)
          || c.name.official.toLowerCase().includes(fil)
    }
  )

  return (
    <div>
      <Filter label={"find countries "} fil={fil} onChange={handleFilChange} />
      <div>
        {
          one ?
          <Country country={one} /> :
          fil.length != 0 ?
            // Too many countries
            filteredCountries.length > 10 ?
              "Too many matches, specify another filter" :
              // 2 -> 10 countries
              filteredCountries.length > 1 ?
                (
                  <div>
                    {filteredCountries.map(c => (
                      <div key={c.cca2}>
                        {c.name.common}
                        <button onClick={() => {
                          setOne(c)
                        }}>Show</button>
                      </div>
                    ))}
                  </div>
                ):
                // 1 country
                filteredCountries.length == 1 ?
                  <Country country={filteredCountries[0]} />
                  : ""
            : ""
        }
      </div>
    </div>
  )
}

export default App