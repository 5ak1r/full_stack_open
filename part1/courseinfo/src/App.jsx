const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part = {props.part1.part} exercises = {props.part1.exercises} />
      <Part part = {props.part2.part} exercises = {props.part2.exercises} />
      <Part part = {props.part3.part} exercises = {props.part3.exercises} />
    </div>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {part: 'Fundamentals of React', exercises: 10},
    {part: 'Using props to pass data', exercises: 7},
    {part: 'State of a component', exercises: 14},
  ]

  return (
    <div>
      <Header course = {course} />
      <Content part1 = {parts[0]} part2 = {parts[1]} part3 = {parts[2]}/>
      <Total total = {parts[0].exercises + parts[1].exercises + parts[2].exercises} />
    </div>
  )
}

export default App