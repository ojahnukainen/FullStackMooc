/* eslint-disable react/prop-types */

import { useState, useEffect, useId } from 'react'
import axios from 'axios'


const Contact = (props) => (
  <div>
    {props.personsToShow.map((key)=><div key={key.number}> {key.name} | {key.number}</div>)}
</div>
)
const Contacts = (props) => {
  const {persons, filterInput, isFiltered} = props
  console.log("contacts filtrInput",props.filterInput.toLowerCase())

  const personsToShow = isFiltered ? 
    persons.filter(value => value.name.toLowerCase().includes(filterInput.toLowerCase())) 
    : persons

  return(
    <Contact personsToShow={personsToShow} />
  )
}
const Filter = (props) =>(
  <form>
    <div>filter show with: <input value={props.valueFilter} onChange={props.handleFilterInput}/></div>
  </form>
)


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [isFiltered, setIsFilterd] = useState(false)
  const db_adress = "http://localhost:3001/persons"


const fetchPersonsFromDB = ()=>{
  console.log("Effect")
  axios.get(db_adress)
        .then(response =>{
          console.log("kisakala on valmis")
          setPersons(response.data)
        })

}

  const addContact = (event) => {
    event.preventDefault()
    
    const duplicateCheck = persons.filter((value)=> value.name.toLocaleLowerCase()===(newName.toLocaleLowerCase()))
    
    if (duplicateCheck.length == 0){
    
      const contactObject = {
        name: newName,
        number: newNumber,
        id: newNumber, //to keep the id unique even things are deleted
      }
      axios.post(db_adress,contactObject).then(response =>{console.log(response)})
      setPersons(persons.concat(contactObject))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already part of the phonebook`)
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNewNumber = (event) => {
    console.log(`handle new name ${event.target.value}`)
    setNewNumber(event.target.value)
  }
  const handleNewName = (event) => {
    console.log(`handle new name ${event.target.value}`)
    setNewName(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterInput(event.target.value)
    console.log(event.target.value.length)
    event.target.value.length > 0 ? 
    setIsFilterd(true) : setIsFilterd(false)
    console.log("setIsfiltered",isFiltered)
  }

    useEffect(fetchPersonsFromDB,[])
  return (
    <div>
      <h1>Phonebook</h1>

      <Filter valueFilter={filterInput} handleFilterInput={handleFilterInput} />
      <h2>Add New User</h2>
      <form onSubmit={addContact}>
        <div>name: <input value={newName} onChange={handleNewName} required/> </div>
        <div>number: <input type="number" value={newNumber} onChange={handleNewNumber} required/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Contacts persons={persons} filterInput={filterInput} isFiltered={isFiltered} />
      
    </div>
  )

}

export default App