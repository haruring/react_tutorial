import { useState } from "react";
function Square({ value, onSquareClick, style }) {
  return (
    <button className={style} onClick={onSquareClick}>
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

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.winningLine : [];
  let status;
  const isDraw = squares.every((square) => square !== null); // 引き分け判定
  if (winner && !isDraw) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((_, i) =>
        i % 3 === 0 ? (
          <div key={`row${i}`} className="board-row">
            {squares.slice(i, i + boardCol).map((_, k) => {
              const index = i + k;
              const isWinningSquare = winningLine.includes(index); // 勝ちパターンのマスを取得
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => {
                    handleClick(index);
                  }}
                  style={isWinningSquare ? "square winning" : "square"} // 勝ちパターンのマスにクラスを追加
                />
              );
            })}
          </div>
        ) : null
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
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

  function handleSort() {
    setIsAscending(!isAscending);
  }

  const sortedHistory = isAscending ? history : [...history].reverse();
  const moves = sortedHistory.map((squares, move) => {
    const actualMove = isAscending ? move : history.length - 1 - move;
    let description;
    if (actualMove > 0) {
      description = `Go to move #${actualMove}`;
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        <GameList
          history={history}
          description={description}
          move={actualMove}
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
        <button type="button" onClick={handleSort}>
          {isAscending ? "▼" : "▲"}
        </button>
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
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return null;
}
