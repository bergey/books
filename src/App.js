import './App.css';
import React, { useState } from 'react'

const e = React.createElement;

function App() {
  const [books, setBooks] = useState(
      [ { title: 'Moby Dick', author: 'Herman Melville' }
      , { title: 'Walden', 'author': 'Henry David Thoreau' }
  ])
  const emptyInput = {title: '', author: '' }
  const [input, setInput] = useState(emptyInput)

  const rows = books.map(book =>
      e ('tr', {}, e('td', {}, book.title), e('td', {}, book.author), e('td')))

  const inputCell = name => (
      <td>
        <input name={name} type="text" value={input[name]}
          onChange={ev => setInput({...input, [name]: ev.target.value })} />
      </td>
  )

  const addRow = () => {
      setBooks([...books, input])
      setInput(emptyInput)
  }

  return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            {inputCell('title')}
            {inputCell('author')}
            <td><button onClick={addRow}>+</button></td>
          </tr>
        </tbody>
      </table>
  )

}

export default App;
