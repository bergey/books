import './App.css';
import React from 'react'

const e = React.createElement;

function App() {
    // TODO use state
  const books =
      [ { title: 'Moby Dick', author: 'Herman Melville' }
      , { title: 'Walden', 'author': 'Henry David Thoreau' }
      ]
  const rows = books.map(book =>
      e ('tr', {}, e('td', {}, book.title), e('td', {}, book.author), e('td')))

  // TODO JSX?
  return e(
      'table',
      {},
        e('thead', {}, e('tr', {}, e('th', {}, 'Title'), e('th', {}, 'Author'), e('th', {}, 'Action'))),
        e('tbody', {}, ...rows,
        e('tr', {className: 'append'}, e('td', {}, e('input')), e('td', {}, e('input')), e('td', {}, e('button', {}, '+')))
    ));

}

export default App;
