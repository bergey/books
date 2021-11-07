'use strict';

const e = React.createElement;

// TODO function style instead of class style
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

// TODO JSX?
    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Books!'
    );
  }
}

const domContainer = document.querySelector('#books');
ReactDOM.render(e(LikeButton), domContainer);
