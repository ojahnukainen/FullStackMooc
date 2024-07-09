/* eslint-disable react/prop-types */
const Course = (props) =>{
    const {course} = props
    return(
        <div>
          <Header name={course.name} />
          <Content parts={course.parts}  />
          <Total parts={course.parts} />
      </div>
    )
  }
   
  const Header = (props) => {
    console.log("Header", props)
    return (
    <h1>{props.name}</h1>  )
  }
  
  const Content = (props) => {
    console.log(props)
    const parts = props.parts
    return(
      <div>
            {parts.map((value) => <Part key={parts.id} parts={value}/> )}
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
    console.log("Totalista moro: ", props.parts)
    let total = 0
    const totals =  props.parts.reduce((accumulator, currentValue) =>  accumulator + currentValue.exercises, total)
    console.log("Päivää että pätkähti", totals)
    return(
      <h3>
        Number of exercises {totals} 
      </h3>
    )
  }

  export default Course