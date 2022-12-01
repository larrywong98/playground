import "./MineSweeper2.css";
import React, { useEffect, useState } from "react";
/**
 *
 * @param {*} props Game config function, width, height, mines limit
 * @returns Input elements
 */
const Input = (props) => {
  const changeGameConfig = (w, h, l) => {
    props.gameConfig(w, h, l);
  };
  return (
    <div>
      <label>Width:</label>
      <input
        type="text"
        onChange={(e) => changeGameConfig(parseInt(e.target.value), 0, 0)}
        value={props.boardWidth}
      />
      <label>Height:</label>
      <input
        type="text"
        onChange={(e) => changeGameConfig(0, parseInt(e.target.value), 0)}
        value={props.boardHeight}
      />
      <label>Number of Mines:</label>
      <input
        type="text"
        onChange={(e) => changeGameConfig(0, 0, parseInt(e.target.value))}
        value={props.minesLimit}
      />
    </div>
  );
};

/**
 *
 * @param {object} props Game board width, height, mines limit
 * @returns Game Board
 */
const Board = (props) => {
  const [gameBoard, setGameBoard] = useState(
    Array(props.boardHeight)
      .fill(0)
      .map((row) => new Array(props.boardWidth).fill(-1))
  );
  const [gameStatus, setGameStatus] = useState("");
  /**
   * Init game board on refresh
   */
  useEffect(() => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({
        boardWidth: props.boardWidth,
        boardHeight: props.boardHeight,
        minesLimit: props.minesLimit,
      }),
    };

    fetch("http://localhost:3100/boardInit", options)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => console.log(data.message));
  }, []);

  /**
   * Update game board status
   */
  useEffect(() => {
    if (props.boardWidth !== gameBoard[0].length) {
      //gameBoard
      setGameBoard(
        Array(gameBoard.length)
          .fill(0)
          .map((row) => new Array(props.boardWidth).fill(-1))
      );
    }
    if (props.boardHeight !== gameBoard.length) {
      setGameBoard(
        Array(props.boardHeight)
          .fill(0)
          .map((row) => new Array(gameBoard[0].length).fill(-1))
      );
    }
  }, [props, gameBoard]);

  /**
   * Post request to generate game board on backend
   */
  const generate = () => {
    setGameStatus("");
    setGameBoard(
      Array(props.boardHeight)
        .fill(0)
        .map((row) => new Array(props.boardWidth).fill(-1))
    );

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers":
        //   "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({
        boardWidth: props.boardWidth,
        boardHeight: props.boardHeight,
        minesLimit: props.minesLimit,
      }),
    };
    fetch("http://127.0.0.1:3100/boardInit", options)
      .then((response) => {
        // fetch("http://144.202.42.97:3000/boardInit", options).then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => console.log(data.message));
  };

  /**
   *
   * Set game board with changed coorindate values
   * @param {Number} x Clicked coordinate x
   * @param {Number} y Clicked coordinate y
   */
  const handleCellOnClick = (x, y) => {
    let newBoard = [...gameBoard];
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Headers":
        //   "Origin, X-Requested-With, Content-Type, Accept",
        // "User-Agent":
        //   "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
      },
      body: JSON.stringify({ x: x, y: y }),
    };
    console.log("ok");
    fetch("http://localhost:3100/clickedPos", options)
      // fetch("http://144.202.42.97:3000/clickedPos", options)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        for (var each of data.changed) {
          var eachValue = each.split(",");
          var x = Number(eachValue[0]);
          var y = Number(eachValue[1]);
          var v = Number(eachValue[2]);
          newBoard[x][y] = v;
        }
        setGameBoard(newBoard);
        if (data.win === 1) {
          setGameStatus("win!!");
        }
        if (data.win === -1) {
          setGameStatus("Failed!!");
        }
      });
  };

  /**
   *
   * @param {object} props Handle cell image at (x,y) position
   * @returns <Cell /> at (x,y) position
   */
  const Cell = (props) => {
    return (
      <div className="cell">
        <button
          className={
            gameBoard[props.x][props.y] === 10
              ? "boom-cell"
              : gameBoard[props.x][props.y] >= 0
              ? "revealed-cell"
              : "unrevealed-cell"
          }
          onClick={() => handleCellOnClick(props.x, props.y)}
        >
          {gameBoard[props.x][props.y] > 0 &&
          gameBoard[props.x][props.y] < 10 ? (
            <h2>{gameBoard[props.x][props.y]}</h2>
          ) : (
            <></>
          )}
        </button>
      </div>
    );
  };

  /**
   * Game board div
   */
  const boardDiv = (
    <div>
      <table className="board">
        <tbody>
          {gameBoard.map((row, x) => {
            return (
              <tr key={x}>
                {row.map((cell, y) => {
                  return (
                    <td key={y}>
                      <Cell x={x} y={y} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  /**
   * Game panel
   */
  return (
    <>
      <button className={"start-game"} onClick={() => generate()}>
        Start Game
      </button>
      {boardDiv}
      <div>
        <h1>{gameStatus}</h1>
      </div>
    </>
  );
};

/**
 *
 * @param {Number} boardwidth
 * @param {Number} boardHeight
 * @param {Number} minesLimit
 * @returns Game
 */
const Game = () => {
  const [boardWidth, setBoardWidth] = useState(20);
  const [boardHeight, setBoardHeight] = useState(20);
  const [minesLimit, setMinesLimit] = useState(30);
  const gameConfig = (w, h, l) => {
    if (w > 0) {
      setBoardWidth(w);
    }
    if (h > 0) {
      setBoardHeight(h);
    }
    if (l > 0) {
      setMinesLimit(l);
    }
  };
  return (
    <div align="center" className="game-panel">
      <Input
        gameConfig={gameConfig}
        boardWidth={boardWidth}
        boardHeight={boardHeight}
        minesLimit={minesLimit}
      />
      <Board
        boardWidth={boardWidth}
        boardHeight={boardHeight}
        minesLimit={minesLimit}
      />
    </div>
  );
};

/**
 *
 * @returns Mine Sweeper Main
 */
export default function MineSweeper2() {
  return (
    // <h1>ppp</h1>
    <Game />
  );
}
