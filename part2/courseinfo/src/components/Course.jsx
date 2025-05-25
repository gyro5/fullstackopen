const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map(p => <Part part={p} key={p.id} />)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p style={{fontWeight: "bold"}} >total of {props.total} exercises</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce((accum, curr) => accum + curr.exercises, 0)} />
    </div>
  )
}

export default Course