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

const EMPTY_VALUE = null;

const emptyState = () => ({
  values: Array(9).fill(null),
  win: null
});

const playerA = 'O';
const playerB = 'X';

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
      const nextIndex = this.calcNextMove(values);
      if (nextIndex !== null) this.turn(nextIndex, playerB);
    }
  };

  getWinningIndex = values => {
    for (const combo of WINNING_COMBOS) {
      let candidate;
      for (const i of combo) {
        if (values[i] === playerA) {
          candidate = undefined;
          break;
        }

        if (values[i] === EMPTY_VALUE) {
          if (candidate === undefined) {
            candidate = i;
          } else {
            candidate = undefined;
            break;
          }
        }
      }
      if (candidate !== undefined) return candidate;
    }
  };

  getDefensiveIndex = values => {
    for (const combo of WINNING_COMBOS) {
      let candidate;
      for (const i of combo) {
        if (values[i] === playerB) {
          candidate = undefined;
          break;
        }

        if (values[i] === EMPTY_VALUE) {
          if (candidate === undefined) {
            candidate = i;
          } else {
            candidate = undefined;
            break;
          }
        }
      }
      if (candidate !== undefined) return candidate;
    }
  };

  getRandomEmptyIndex = values => {
    const options = values.reduce(
      (acc, value, index) => (value === null ? [...acc, index] : acc),
      []
    );
    return (
      options.length > 0 && options[Math.floor(Math.random() * options.length)]
    );
  };

  calcNextMove = values => {
    const winningIndex = this.getWinningIndex(values);
    if (winningIndex !== undefined) return winningIndex;

    const defensiveIndex = this.getDefensiveIndex(values);
    if (defensiveIndex !== undefined) return defensiveIndex;

    return this.getRandomEmptyIndex(values);
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
    const getBoxClassName = (value, index) =>
      cx('box', {
        locked: this.state.win || this.state.values[index],
        win: this.isWinningCell(index),
        playerA: value === playerA,
        playerB: value === playerB
      });
    return this.state.values.map((value, index) => (
      <div
        key={index}
        onClick={() => this.handleBoxClick(index)}
        className={getBoxClassName(value, index)}
      >
        {value}
      </div>
    ));
  }

  render() {
    const showReplayBtn =
      this.state.win || this.state.values.every(i => i !== EMPTY_VALUE);
    return (
      <main>
        <div>
          <div className="container">{this.renderBoxes()}</div>
          <button
            className={cx('replay', { visible: showReplayBtn })}
            onClick={this.handleReplay}
          >
            Replay
          </button>
        </div>
      </main>
    );
  }
}

export default App;
