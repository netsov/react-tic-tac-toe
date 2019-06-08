import React from 'react';
import './App.css';

import cx from 'classnames';

const ROWS = () => [[null, null, null], [null, null, null], [null, null, null]];

const WINNING_COMBOS = [
  [[0, 0], [0, 1], [0, 2]],

  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],

  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],

  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];

const playerA = '0';
const playerB = 'x';

class App extends React.Component {
  state = {
    rows: ROWS()
  };

  turn(rowIndex, colIndex, player) {
    const { rows } = this.state;

    rows[rowIndex][colIndex] = player;
    const isWin = this.checkWin(rows, player);
    this.setState({ rows, win: isWin });

    return isWin;
  }

  handlePlayerA = (rowIndex, colIndex) => {
    const { rows, win } = this.state;
    if (win || rows[rowIndex][colIndex]) return;

    const isWin = this.turn(rowIndex, colIndex, playerA);

    if (!isWin) {
      const next = this.randomPick(rows);
      next && this.turn(...next, playerB);
    }
  };

  randomPick = rows => {
    const options = rows.reduce((acc, row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) acc.push([rowIndex, colIndex]);
      });
      return acc;
    }, []);

    return (
      options.length > 0 && options[Math.floor(Math.random() * options.length)]
    );
  };

  handleReplay = () => this.setState({ rows: ROWS(), win: null });

  isWinningCell = (rowIndex, colIndex) =>
    this.state.win &&
    this.state.win.some(([y, x]) => y === rowIndex && x === colIndex);

  checkWin(rows, player) {
    let win = null;
    for (const combo of WINNING_COMBOS) {
      if (
        combo.every(
          ([rowIndex, colIndex]) => rows[rowIndex][colIndex] === player
        )
      ) {
        win = combo;
      }
    }
    return win;
  }

  render() {
    const { rows, win } = this.state;
    return (
      <main>
        <table>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td
                    className={cx({
                      locked: win || rows[rowIndex][colIndex],
                      win: this.isWinningCell(rowIndex, colIndex)
                    })}
                    key={colIndex}
                    onClick={() => this.handlePlayerA(rowIndex, colIndex)}
                  >
                    <em>{value}</em>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={this.handleReplay}>Replay</button>
      </main>
    );
  }
}

export default App;
