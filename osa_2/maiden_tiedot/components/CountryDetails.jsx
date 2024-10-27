import WeatherDetails from '../components/WeatherDetails';

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

        <WeatherDetails capital={data.capital} />
      </div>
    )
  }

  export default CountryDetails