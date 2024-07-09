const Header = (props) => {
  return (
  <h1>{props.course.name}</h1>  )
}

const Content = (props) => {
  console.log(props.course)
  const parts = props.course.parts
  return(
    <div>
          {parts.map((value) => <Part parts={value}/> )}
    </div>
)}

const Part = (props) => { 
  const {name, exercises} = props.parts
  return(
  <p>
    {name} {exercises}
  </p>
)}

const Total = (props) => {
  console.log(props.course.parts)
  let total = 0
  const totals =  props.course.parts.map(value => { total = total + value.exercises})
  return(
    <p>
      Number of exercises {total} 
    </p>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course}  />
      <Total course={course} />
    </div>
  )
}

export default App