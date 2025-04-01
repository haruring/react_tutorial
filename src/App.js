import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function GameList({ move, jumpTo, description, currentMove }) {
  if (move === currentMove) {
    return description;
  } else {
    return <button onClick={() => jumpTo(move)}>{description}</button>;
  }
}

function Board({ xIsNext, squares, onPlay }) {
  const boardCol = 3;
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return; // すでに埋まっている場合や勝敗が決まっている場合は何もしない
    const nextSquares = squares.slice();
    if (xIsNext) {
      // XとOを交互に配置
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  console.log(squares);
  const board = squares.map((square, i) => {
    <Square value={squares[i]} onSquareClick={() => handleClick(i)} />;
  });

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((_, i) =>
        i % 3 === 0 ? (
          <div key={`row${i}`} className="board-row">
            {squares.slice(i, i + boardCol).map((_, k) => (
              <Square
                key={i + k}
                value={squares[i + k]}
                onSquareClick={() => handleClick(i + k)}
              />
            ))}
          </div>
        ) : null
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // 現在の手番を計算
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // 現在の手番を更新
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`;
    }

    return (
      <li key={move}>
        <GameList
          description={description}
          move={move}
          currentMove={currentMove}
          jumpTo={jumpTo}
        />
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    // 勝ちパターン
    [0, 1, 2], // 1行目横一列
    [3, 4, 5], // 2行目横一列
    [6, 7, 8], // 3行目横一列
    [0, 3, 6], // 1列目縦一列
    [1, 4, 7], // 2列目縦一列
    [2, 5, 8], // 3列目縦一列
    [0, 4, 8], // 左上から右下斜め一列
    [2, 4, 6], // 右上から左下斜め一列
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
