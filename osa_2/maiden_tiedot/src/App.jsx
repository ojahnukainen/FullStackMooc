import { useState, useEffect} from 'react'
import axios from "axios";
import './App.css'
import Countries from '../components/Countries';

const base_url = 'https://studies.cs.helsinki.fi/restcountries/api/all'

function App() {
  const [searchText, setSearchText] = useState("")
  const [countryData, setCountryData] = useState([])

  const fetchCountryData = ()=>{
    axios.get(base_url)
    .then(response => {
      setCountryData(response.data)
    })
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
          <Countries countryData={countryData} searchText={searchText} handleSearchText={handleSearchText}/>
      </div>
    </form>
    </>
  )
}

export default App
