import { useState, useEffect} from 'react'
import axios from "axios";

const api_key = import.meta.env.VITE_KEY
const weatherApi = 'https://api.openweathermap.org/data/2.5/weather?'

const WeatherDetails = (props) =>{
    const [weatherDetails, setWeatherDetails] = useState()
    const capital  = props.capital
    const weatherUrl = `${weatherApi}q=${capital}&units=metric&id&appid=${api_key}`
  
  
    const getWeather = () =>{
      axios
        .get(weatherUrl)
        .then((response)=>{
            setWeatherDetails(response.data)
            console.log(response.data, "get weather")
           
        })
        .catch((error) => {
            if(error.status == 401){
                console.log("You don't have the api key inserted")
            } else {
                 console.log(error, "Something did not quite work")
            }
        })
    }
  
    useEffect(getWeather,[capital])
  
    if (weatherDetails !== undefined) {
      return(
        <div>
          <h2>Weather in {capital }</h2>
          <p>Temperature: {weatherDetails.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`}></img>
          <p>Wind: {weatherDetails.wind.speed} m/s</p>
        </div>
      )
    }
  }

  export default WeatherDetails