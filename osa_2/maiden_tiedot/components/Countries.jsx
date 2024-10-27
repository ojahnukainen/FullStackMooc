import CountryDetails from "./CountryDetails"
import CountryList from "./CountryList"


const Countries = (props) =>{
  const lista = props.searchText.length > 0 ? 
    props.countryData.filter(x => 
      x.name.common.toLowerCase().includes(props.searchText.toLowerCase())) : props.countryData
  
  if(lista.length > 10) return(<div><b>There is too many mactches, please specify more</b></div>)
  if(lista.length > 1) return(
    <CountryList lista={lista} handleSearchText={props.handleSearchText}/>
  )
  if(lista.length === 1) return(
    <CountryDetails data={lista[0]}/>
  )
  } 

export default Countries