import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const length = anecdotes.length

  const [votes, setVotes] = useState(Array(length).fill(0))
  const [selected, setSelected] = useState(0)

  const handleRandomChoice = () => {
    let randomIndex = selected
    while(randomIndex === selected) {
      randomIndex = Math.floor(Math.random() * length);
    }
    
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const highestVotesIndex = votes.reduce((maxIdx, current, i, array) => 
  current > array[maxIdx] ? i : maxIdx, 0);

  const voteLabel = votes[selected] === 1 ? 'vote': 'votes'
  const voteLabelHighest = votes[highestVotesIndex] === 1 ? 'vote': 'votes'

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      {anecdotes[selected]}
      <div>This anecdote has {votes[selected]} {voteLabel}.</div>
      <div>
        <button onClick={handleVote}>vote</button>
        <button onClick={handleRandomChoice}>randomise</button>
      </div>

      <h1>Anecdote with the most votes</h1>
      {anecdotes[highestVotesIndex]}
      <div>This anecdote has {votes[highestVotesIndex]} {voteLabelHighest}.</div>

    </div>
  )
}

export default App