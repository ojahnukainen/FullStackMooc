/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import personsService from './services/persons.js'

const Contact = (props) => (
  <div>
    {props.personsToShow.map((key)=><h4 key={key.number}> {key.name} | {key.number} <button onClick={props.handleRemoveContact} name={key.name} id={key.id}>X</button></h4>)}
</div>
)
const Contacts = (props) => {
  const {persons, filterInput, isFiltered, handleRemoveContact} = props

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

const Notification = (props) =>{
  if (props.message === null){
    return null
  }
  return(
    <div className={props.notificationClass}>
        {props.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [isFiltered, setIsFilterd] = useState(false)
  const [message, setMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState(null)

const fetchPersonsFromDB = ()=>{
  personsService
        .getAll()
        .then(response =>{
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

        setMessage(`${newName} with number ${newNumber} has been added to the phonebook`)   
        setTimeout(()=>{
          setMessage(null)
        },5000) 
    } else {
        if (window.confirm(`${newName} is already part of the phonebook, would you like to update the number`)){
          const enteredName = event.target[0].value
          const person = persons.find(p => p.name === enteredName)  
          const updatedPerson = {...person, id: newNumber,number: newNumber,}
          
          personsService.update(person.id, updatedPerson)
            .then(response =>{
              setPersons(persons.map(person => person.name !== enteredName ? person : response.data))
            
          setNewName('')
          setNewNumber('')
          
          setMessage(`${newName} number has been upated to ${newNumber} to the phonebook`)
          setNotificationClass("notification")   
          setTimeout(()=>{
            setMessage(null)
            setNotificationClass(null)
          },5000) 

          }).catch(error =>{console.log("Well something went wrong. check this", error)})
        } else {
          setNewName('')
          setNewNumber('')
        }
      
    }
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterInput(event.target.value)
    event.target.value.length > 0 ? 
    setIsFilterd(true) : setIsFilterd(false)
  }

  const handleRemoveContact = (event) =>{
    event.preventDefault()
    if(window.confirm(`Do you want to delete ${event.target.name}`)){
      personsService
      .deletePerson(event.target.id)
      .then(response =>{
        setPersons(persons.filter(person => person.name !== event.target.name))

        setMessage(`${event.target.name} number has been removed from the phonebook`)
        setNotificationClass("notification")   
          setTimeout(()=>{
            setMessage(null)
            setNotificationClass(null)
          },5000) 

      }).catch(response=>{
        console.log("jokin meni nyt pieleen", response)
        setMessage(`${event.target.name} number has been already probably removed from the phonebook`)
        setNotificationClass("errorNotification")   
          setTimeout(()=>{
            setMessage(null)
            setNotificationClass(null)
          },5000) 
      }
        
      )
    }    
  }
    useEffect(fetchPersonsFromDB,[])
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} notificationClass={notificationClass} />
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