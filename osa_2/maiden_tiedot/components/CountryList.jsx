
const CountryList = (props) =>{
    let idkey = 0
    const data = props.lista
   return(
      <div>
          {data.map((key) => 
            <div className='showCountry' key={idkey = idkey + 1}>
              <h6>{key.name.common} </h6>
              <button value={key.name.common} onClick={props.handleSearchText}>Show</button>
            </div>
          )}
      </div>
   )
  }

export default CountryList