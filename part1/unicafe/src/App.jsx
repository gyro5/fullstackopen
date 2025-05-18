import { useState } from 'react'

const Header = ({title}) => (
  <h1>{title}</h1>
);

const Button = ({onClick, text}) => (
  <button onClick={onClick}>{text}</button>
);

const FeedbackBoard = ({stats}) => (
  <div>
    <Header title={"give feedback"} />
    {stats.map((s) => (<Button onClick={s.setter} text={s.label} key={s.label}/>))}
  </div>
);

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({stats}) => {
  const totalCount = stats.map((s) => s.data).reduce((accum, curr) => accum + curr, 0);

  const avg = stats.map((s) => s.data * s.score).reduce((accum, curr) => accum + curr, 0) / totalCount;

  const positve = stats[0].data / totalCount * 100;

  if (totalCount > 0) {
    return (
      <div>
        <Header title={"statistics"} />

        <table>
          <tbody>
            {stats.map((s) => (<StatisticLine text={s.label} value={s.data} key={s.label} />))}
            <StatisticLine text={"all"} value={totalCount} />
            <StatisticLine text={"average"} value={avg} />
            <StatisticLine text={"positive"} value={(positve) + " %"} />
          </tbody>
        </table>

      </div>
    );
  }
  else {
    return (
      <div>
        <Header title={"statistics"} />
        <p>No feedback given</p>
      </div>
    )
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const stats = [
    {
      label: "good",
      data: good,
      score: 1,
      setter: () => setGood(good + 1),
    },
    {
      label: "neutral",
      data: neutral,
      score: 0,
      setter: () => setNeutral(neutral + 1),
    },
    {
      label: "bad",
      data: bad,
      score: -1,
      setter: () => setBad(bad + 1),
    }
  ];

  return (
    <div>
      <FeedbackBoard stats={stats} />
      <Statistics stats={stats} />
    </div>
  );
};

export default App;