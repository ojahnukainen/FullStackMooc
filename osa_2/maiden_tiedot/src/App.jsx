import { useState, useEffect} from 'react'
import axios from "axios";
import './App.css'

const base_url = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () =>{
  return axios.get(base_url)
}

const CountryDetails = (props) =>{
  let idkey = 9999
  const data  = props.data
  return(
    <div key={data.id}>
          <h1>{data.name.common}</h1>
          <div>Capital: {data.capital}</div>
          <div>Area: {data.area}</div>
          <h3>Languages</h3>
          {Object.values(data.languages).map((k) =>  <li key={idkey = idkey + 1}>{k}</li>)}
          <img src={data.flags.png}/>
        
      </div>
  )
}

const CountryList = (props) =>{
  let idkey = 0
  const data = props.lista
 return(
    <div>
        {data.map((key) => 
          <div className='showCountry' key={idkey = idkey + 1}>
            <h6>{key.name.common} </h6>
            <button value={key.name.common} onClick={props.handleShowButton}>Show</button>
          </div>
        )}
    </div>
 )
}

const Countries = (props) =>{
  const lista = props.searchText.length > 0 ? 
    props.countryData.filter(x => 
      x.name.common.toLowerCase().includes(props.searchText.toLowerCase())) : props.countryData

  if(lista.length > 10) return(<div><b>There is too many mactches, please specify more</b></div>)
  if(lista.length > 1) return(
    <CountryList lista={lista} handleShowButton={props.handleShowButton}/>
  )
  if(lista.length === 1) return(
    <CountryDetails data={lista[0]}/>
  )
} 


function App() {
  const [searchText, setSearchText] = useState("")
  const [countryData, setCountryData] = useState([])

  const fetchCountryData = ()=>{
    axios.get(base_url)
    .then(response => {
      setCountryData(response.data)
    })
  }

  const handleShowButton = (event) =>{
    event.preventDefault()
    setSearchText(event.target.value)
  }

  const handleSearchText = (event) =>{
    event.preventDefault()
    setSearchText(event.target.value)
  }

  useEffect(fetchCountryData,[])
  return (
    <>
     <form>
      <div>
          Find countries: <input value={searchText} onChange={handleSearchText}/>
          <Countries countryData={countryData} searchText={searchText} handleShowButton={handleShowButton}/>
      </div>
    </form>
    </>
  )
}

export default App
