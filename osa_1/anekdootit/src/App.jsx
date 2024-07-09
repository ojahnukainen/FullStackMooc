import { useState } from 'react'

const Button = (props) =>{
  return(
    <button onClick={props.handleClick}>
        {props.text}
    </button>
  )
}

const MostVotes = (props) =>{
  const {anecdotes, votes} = props
  const mostVotes = Math.max(...votes);
  const indexForVote = votes.indexOf(mostVotes);

  return(
    <div>
      <h2>Anecdote with most votes</h2>
      <p>
        {anecdotes[indexForVote]}
      </p>
      <h4>
        Has {mostVotes} votes
      </h4>
    </div>
   
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const handleNextAne = () =>{
    return(
      setSelected(Math.floor(Math.random()* 7))
    )
  }
  const handleVotes = () =>{
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(10+1).join('0').split('').map(parseFloat))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
      {anecdotes[selected]}
      </p>
      <h4>Has {votes[selected]} votes</h4>
      <Button text="Vote" handleClick={()=>handleVotes()}/> 
      <Button text="next anecdote" handleClick={()=>handleNextAne()}/>
      <MostVotes anecdotes={anecdotes} votes={votes}/>
    </div>
  )
}

export default App
