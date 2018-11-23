import React      from 'react';
import PropTypes  from 'prop-types';

import { tableConfig, humanPlayer, aiPlayer, winCombos } from '../../../lib/config';
import './_home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: Array.from(Array(9).keys()),
      gameStarted: false,
      result: '',
      gameWon: {},
      cellColor: '#fff',
    };

    this.startGame = this.startGame.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.playTurn = this.playTurn.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.showResult = this.showResult.bind(this);
    this.emptySquares = this.emptySquares.bind(this);
    this.minimax = this.minimax.bind(this);
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    const cells = document.getElementsByClassName('cell');

    this.setState({
      gameStarted: true,
      gameWon: {},
      moves: Array.from(Array(9).keys())
    });
  }

  handleCellClick(placeId) {
    if (typeof this.state.moves[placeId] === 'number') {
      this.playTurn(placeId, humanPlayer);
      if (!this.checkTie()) this.playTurn(this.idealMove(), aiPlayer);
    }
  }

  playTurn(squareId, player) {
    const { moves } = this.state;
    moves[squareId] = player;
    this.setState({ moves });
    const gameWon = this.checkWin(this.state.moves, player);
    if (gameWon) {
      this.gameOver(gameWon);
    }
  }

  checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index: index, player: player};
        break;
      } 
    }
    return gameWon;
  }

  gameOver(gameWon) {
    const cellColor = gameWon.player === humanPlayer ? '#4da6ff' : '#ff0000';
    this.setState({gameWon, cellColor})

    this.showResult(gameWon.player === humanPlayer ? 'You won! 👏' : 'You lost🙁')
  }

  showResult(result) {
    this.setState({
      gameStarted: false,
      result,
    });
  }

  emptySquares() {
    return this.state.moves.filter(s => typeof s === 'number');
  }

  idealMove() {
    return this.minimax(this.state.moves, aiPlayer).index;
  }

  checkTie() {
    if (this.emptySquares().length === 0) {
      const cellColor = '#ffde66';
      this.setState({ cellColor })
      this.showResult("It's a tie! 😯")

      return true;
    }
    return false;
  }

  minimax(newBoard, player) {
    const availSpots = this.emptySquares(newBoard);

    if (this.checkWin(newBoard, player)) {
      return { score: -10 };
    } else if (this.checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player === aiPlayer) {
        const result = this.minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        const result = this.minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  render() {
    const { cellColor, gameWon } = this.state;
    const rows = Array.from(Array(tableConfig.rows).keys());
    const columns = Array.from(Array(tableConfig.columns).keys());
    const winningCombo = winCombos[gameWon.index];
    
    let placeId = 0;

    return (
      <div>
        <table>
          <tbody>
            { 
              rows.map((row, index) => (
                <tr key={index + 1}>
                  {
                    columns.map(() => {
                      const id = placeId;
                      placeId += 1;
                      const value = parseInt(this.state.moves[id]) > -1 ? '' : this.state.moves[id];
                      return (
                        <td
                          className="cell"
                          id={id}
                          key={id}
                          onClick={() => this.handleCellClick(id)}
                          style={ winningCombo && winningCombo.includes(id) ? {backgroundColor: cellColor} : {backgroundColor: '#fff'}}
                        >
                          { value }
                        </td>
                      )}
                    )
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
        { !this.state.gameStarted &&
          <div className="result">
            <div className="text">{ this.state.result }</div>
            <button onClick={this.startGame}>Try again</button>
          </div>
        }
        </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
