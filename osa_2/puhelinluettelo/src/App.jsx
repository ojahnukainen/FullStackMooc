/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import personsService from './services/persons.js'

const RemoveContactButton = (props) =>{
  
  
  return(
    <form onSubmit={removeContact}>
    <button type="submit">x</button>
    </form>
  )
 
}

const Contact = (props) => (
  <div>
    {props.personsToShow.map((key)=><h4 key={key.number}> {key.name} | {key.number} <button onClick={props.handleRemoveContact} name={key.name} id={key.id}>X</button></h4>)}
</div>
)
const Contacts = (props) => {
  const {persons, filterInput, isFiltered, handleRemoveContact} = props
  console.log("contacts filtrInput",props.filterInput.toLowerCase())

  const personsToShow = isFiltered ? 
    persons.filter(value => value.name.toLowerCase().includes(filterInput.toLowerCase())) 
    : persons

  return(
    <Contact personsToShow={personsToShow} handleRemoveContact={handleRemoveContact}/>
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


const fetchPersonsFromDB = ()=>{
  console.log("Effect")
  personsService
        .getAll()
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
      personsService.create(contactObject)
      .then(response =>
        {console.log(response)})
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

  const handleRemoveContact = (event) =>{
    event.preventDefault()
    console.log("juhuu remove contact", event)
    console.log("remove contact", event.target.id)
    if(window.confirm(`Do you want to delete ${event.target.name}`)){
      personsService
      .deletePerson(event.target.id)
      .then(response =>{
        console.log(response)
        setPersons(persons.filter(person => person.name !== event.target.name))
        
      }).catch(response=>{console.log("jokin meni nyt pieleen", response)}
        
      )
    }    
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
      <Contacts persons={persons} filterInput={filterInput} isFiltered={isFiltered} handleRemoveContact={handleRemoveContact}/>
      
    </div>
  )

}

export default App