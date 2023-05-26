import { useState } from 'react';

function Square({value, onSquareClick}) {
   return (
    //receives value prop from Board component
    //call onSquareClick from Board when square is clicked
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
   );
}

//takes three props, can be called with updated squares array, when move is made
function Board( {xIsNext, squares, onPlay, size} ) {
  const sizeBoard = Array(size)
    for (let i = 0; i < size; i++) {
      const sizeSquares = Array(size);
        for (let j=0; j<size; j++) {
          sizeSquares[j] = <Square value={squares[i*size + j]} onSquareClick={() => handleClick(i * size + j)} />;
        }
        sizeBoard[i] = <div className="board-row">{sizeSquares}</div>
    }

    //update squares array holding state
  function handleClick(i) { 
    //check if square is already filled or a player has won --> state not updated if already filled
    if (squares[i] || calculateWinner(squares)) { 
      return;
    }
    //copy of squares array (immutability --> default data intact)
    const nextSquares = squares.slice(); 
    if (xIsNext) {
      //update nextSquares array --> add X to square ([i])
      nextSquares[i] = 'X'; 
    } else {
      //update nextSquares array --> add X to square ([i])
      nextSquares[i] = "O"; 
    }
    //Game component updates Board when user clicks square
    onPlay(nextSquares); 
  }

  //display which player is next; display winner
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }

  return (
    //value prop is passed down to each square
    //onSquareClick prop connected to handleClick function
    //onSquareClick prop added to first Square component --> connection of onSquareClick to handleClick
    //() => handleClick(0) arrow function --> when clicked, code after arrow runs
    <div>
      <header>
        <h1>Play some Tic Tac Toe Tee</h1>
      </header>
        <div className="status">{status}</div>
        {sizeBoard}
        </div>
  );
}

//top level component
//renders Board component
//aditional divs --> game information added
export default function Game() {
    //state variable history, default: array of 16 nulls; useState() declares squares state variable, initially set to this array
  const [history, setHistory] = useState([Array(16).fill(null)]); 
  //keep track which step user is viewing, default 0
  const [currentMove, setCurrentMove] = useState(0);
  //each time player moves, xIsNext is flipped to determine who goes next, based on currentMove
  const xIsNext = currentMove % 2 === 0; 
  //currently selected move
  const currentSquares = history[currentMove];

  //called by Board component to update game --> re-render
  //history state variable stores information, is updated by appending updated squares array as new history entry
  //calls xIsNext (Board did that before)
  function handlePlay(nextSquares) {
    //only keep portion up to point we went back to
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    //update currentMove to latest history entry
    setCurrentMove(nextHistory.length - 1);
  }

  //upadtes currentMove, xIsNext set to true if number changing currentMove to is even --> correct Player displayed
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  //map used to transform history of moves into React elements (represent buttons on screen)
  //display list of buttons to go to past moves
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      //create list item containing button; button with onCLick handler --> calls function jumpTo
      //key tells React about identity of each component --> move index as key (moves not re-ordered, deletet or inserted in between)
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    //props xIsNext, currentSquares and handlePlay passed to Board component
    //prop moves passed to show buttons representing past moves
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}  size={4} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//declaring a winner; takes array of nine squares, checks for winner and returns 'X', 'O' or null
function calculateWinner(squares) {
  const lines = [
    //rows
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],

    //columns
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],

    //diagonals
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (
      squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c] && 
      squares[a] === squares [d]
    ) {
      return squares[a];
    }
  }
  return null;
}