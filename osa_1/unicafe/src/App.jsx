import { useState } from 'react'

const Button = (props )=>{
  return(
    <button onClick={props.handleClick}>{props.text}</button>
  )
}
const StatisticLine = (props) =>{
  const {text, value} = props
  return(
    <tr>
          <td style={{padding: "5px"}}>{text}</td>
          <td>{value}</td>
    </tr>
  )
    
 
}

const Statistics = (props) =>{
  const {good, bad, neutral} = props
  const all = good + bad + neutral
  const average = (good - bad) / all
  const positive = (good/all)*100
  if (all === 0){
    return(
      <p>There is no stats currently</p>
    )
  }
  
  return(
    <div>
      <table id="fixedheight">
        <tbody> 
          <StatisticLine text="good" value ={good}/>
          <StatisticLine text="neutral" value = {neutral}/>
          <StatisticLine text="bad" value = {bad}/>
          <StatisticLine text="all" value = {all}/>
          <StatisticLine text="average" value = {average}/>
          <StatisticLine text="positive" value = {positive}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = ()=>{
    console.log("Good: " + good)
    setGood(good+1);
  }

  const setToNeutral = ()=>{
    console.log("N: " + neutral)
    setNeutral(neutral+1);
  }

  const setToBad = ()=>{
    console.log("B: " + bad)
    setBad(bad+1);
  }
      

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={()=> setToGood()} text="Good"></Button>
      <Button handleClick={()=> setToNeutral()} text="Neutral"></Button>
      <Button handleClick={()=> setToBad()} text="Bad"></Button>

      <h2>statistics</h2>
  
      <Statistics good={good} bad={bad} neutral={neutral}/>
      
    </div>
  )
}

export default App