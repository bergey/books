'use strict';

const e = React.createElement;

// TODO function style instead of class style
class BooksTable extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          books:
            [ { title: 'Moby Dick', author: 'Herman Melville' }
            , { title: 'Walden', 'author': 'Henry David Thoreau' }
            ]
      };
  }

  render() {
    const rows = this.state.books.map(book =>
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
}

ReactDOM.render(e(BooksTable), document.querySelector('#books'));
