import React from 'react';
import PropTypes from 'prop-types';
import { tableConfig, humanPlayer, aiPlayer, winCombos } from '../../../lib/config';
import './_home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moves: Array.from(Array(9).keys()),
      gameStarted: false,
      winner: '',
    }

    this.startGame = this.startGame.bind(this);
    this.turnClick = this.turnClick.bind(this);
    this.turn = this.turn.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.declareWinner = this.declareWinner.bind(this);
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
      moves: Array.from(Array(9).keys())
    });

    for (var i=0; i< cells.length; i++) {
      cells[i].innerText = '';
      cells[i].style.removeProperty('background-color');
    }
  }

  turnClick(placeId) {
    if (this.state.gameStarted) {
      if (typeof this.state.moves[placeId] === 'number') {
        this.turn(placeId, humanPlayer)
        if (!this.checkTie()) this.turn(this.bestSpot(), aiPlayer);
      }
    }
  }

  turn(squareId, player) {
    const { moves } = this.state;
    moves[squareId] = player;
    this.setState({ moves });
    document.getElementById(squareId).innerText = player;
    const gameWon = this.checkWin(this.state.moves, player);
    if (gameWon) this.gameOver(gameWon);
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
    for (let index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor = 
      gameWon.player === humanPlayer ? "#4da6ff" : "#ff0000";
    }

    setTimeout(this.declareWinner(gameWon.player === humanPlayer ? "You won! 👏" : "You lost🙁 "), 10000)

  } 

  declareWinner(winner) {
    this.setState({
      gameStarted: false,
      winner,
    });
  }

  emptySquares() {
    return this.state.moves.filter(s => typeof s === 'number');
  }

  bestSpot() {
    return this.minimax(this.state.moves, aiPlayer).index;
  }

  checkTie() {
    if (this.emptySquares().length === 0) { 
      const cells = document.getElementsByClassName('cell');

      for (let i = 0; i < cells.length; i++) { 
        cells[i].style.backgroundColor = "#66ff66";
      }
      this.declareWinner("It's a tie! 😯")
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
        let result = this.minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        let result = this.minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if(player === aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i; 
        }
      }
    } else { // when human Player
      let bestScore = 10000;
      for(var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  render() {
    const rows = Array.from(Array(tableConfig.rows).keys());
    const columns = Array.from(Array(tableConfig.columns).keys());
    let placeId = 0;

    return (
      <div>
        <table>
          <tbody>
            { 
              rows.map((row, index) => (
                <tr key={ index + 1 }>
                  {
                    columns.map((column) => {
                      const id = placeId;
                      placeId += 1;

                      return (
                        <td 
                          className="cell"
                          id={id}
                          key={id}
                          onClick={() => this.turnClick(id)}>
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
            <div className="text">{ this.state.winner }</div>
            <button onClick={ this.startGame }>Try again</button>
          </div>
        }
        </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
