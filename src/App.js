import React from 'react';
import './App.css';

import cx from 'classnames';

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [6, 4, 2]
];

const emptyState = () => ({
  values: Array(9).fill(null),
  win: null
});

const playerA = '0';
const playerB = 'x';

class App extends React.Component {
  state = emptyState();

  turn(index, player) {
    const { values } = this.state;
    values[index] = player;
    const isWin = this.checkWin(values, player);
    this.setState({ values, win: isWin });
    return isWin;
  }

  handleBoxClick = index => {
    const { values, win } = this.state;
    if (win || values[index]) return;

    const isWin = this.turn(index, playerA);

    if (!isWin) {
      const nextIndex = this.randomPick(values);
      if (nextIndex !== null) this.turn(nextIndex, playerB);
    }
  };

  randomPick = values => {
    const options = values.reduce(
      (acc, value, index) => (value === null ? [...acc, index] : acc),
      []
    );
    return (
      options.length > 0 && options[Math.floor(Math.random() * options.length)]
    );
  };

  handleReplay = () => this.setState(emptyState());

  isWinningCell = index =>
    this.state.win && this.state.win.indexOf(index) !== -1;

  checkWin(values, player) {
    for (const combo of WINNING_COMBOS) {
      if (combo.every(index => values[index] === player)) return combo;
    }
    return null;
  }

  renderBoxes() {
    return this.state.values.map((value, index) => (
      <div
        key={index}
        onClick={() => this.handleBoxClick(index)}
        className={cx('box', {
          locked: this.state.win || this.state.values[index],
          win: this.isWinningCell(index)
        })}
      >
        {value}
      </div>
    ));
  }

  render() {
    return (
      <main>
        <div className="container">{this.renderBoxes()}</div>
        <button onClick={this.handleReplay}>Replay</button>
      </main>
    );
  }
}

export default App;
