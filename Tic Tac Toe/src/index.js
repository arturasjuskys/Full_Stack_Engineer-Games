import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// This is function component version of class Square
function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

/*

  This is class version of function component Square(props) {}

class Square extends React.Component {
  render() {
    return (
      <button
      className="square"
      // Re-renders square button on click
      onClick={ () => this.props.onClick() }
      >
        // { takes 'X', 'O' or 'null' to be rendered }
        {this.props.value}
      </button>
    );
  }
}

*/

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        // reading the state from array defined in Board constructor, value will read either 'X', 'O' or 'null'
        value={ this.props.squares[i] }
        // Square updates Board's state
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // Setting up initial game state
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    // .slice() parameter - ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    // makes a copy of squares array
    const squares = current.squares.slice();
    
    // short circuits if there is a winner
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // flips current game state value between 'X' & 'O'
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      // updating history array, .concat() dont mutate original array, unlike .push() does
      history: history.concat([{
        squares: squares,
      }]),
      // sets step counter
      stepNumber: history.length,
      // flips states between 'true' & 'false'
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      // reasigns step counter
      stepNumber: step,
      // flips between 'true' & 'false'
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    // takes in latest game history entry to determine and display game's state
    const history = this.state.history;
    // rendering the currently selected move according to stepNumber
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // creating a list of buttons for past moves
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        // creating move histories button for the list to be displayed
        // in this case 'key' is okey to be an index/move because the list will not have any reorder functionality, otherwise unique ID would be advisable
        <li key={ move }>
          <button onClick={ () => this.jumpTo(move) }>{desc}</button>
        </li>
      );
    });

    let status;
    // checks for winner and displays updated player
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
          // updates current game state
            squares={ current.squares }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          {/* dispaying game state */}
          <div>{ status }</div>
          {/* displaying history of moves */}
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
