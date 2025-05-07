import { useState } from "react";

import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";

// 从外部文件导入的获胜组合数组。
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

// 初始玩家名称，X 和 O 分别对应 “Player 1” 和 “Player 2”。
const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

// 3x3 棋盘的初始状态，所有格子为 null
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

/*
  @Brief : 根据游戏回合（gameTurns）确定当前活跃玩家。

  @Note :  确保玩家轮流下棋。

  默认从 X 开始。
  如果有回合记录且最新回合是 X，则切换到 O。
*/
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

/*
  @Brief : 根据回合记录生成当前棋盘状态。

  @Note : 返回：更新后的 3x3 棋盘数组。

深拷贝 INITIAL_GAME_BOARD（避免直接修改原始数组）。 MJ_NOTE 
遍历 gameTurns，将每个回合的 player（X 或 O）填入对应位置。
  
*/
function deriveGameBoard(gameTurns) {
  //

  // MJ_NOTE
  // 这行代码涉及 JavaScript 的数组操作、深拷贝和扩展运算符（spread operator）

  /*
    目的：创建一个新的二维数组 gameBoard，作为游戏棋盘的初始状态。
    来源：基于 INITIAL_GAME_BOARD（假设是一个二维数组）。
    关键点：使用扩展运算符和 map 方法实现数组的深拷贝。
  */

  /* MJ_NOTE
  方式：结合 map 和扩展运算符。
  效果：深拷贝二维数组。

  过程：
  内层 [...array]：复制每个子数组。
  map：生成新子数组集合。
  外层 [...]：创建新外层数组。
  */
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

/*
  @Brief : 检查是否有获胜者。

  @Note : 返回：获胜者名称或 undefined。

  遍历 WINNING_COMBINATIONS，检查每个组合的三个格子。
  如果三个格子非空且符号相同，返回对应玩家的名称（如 “Player 1”）。

  MJ_NOTE MJ_NOTE MJ_NOTE 
*/
function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

/*
  @Brief :

  @Note :

  状态派生：activePlayer、gameBoard、winner 从 gameTurns 动态计算，避免冗余状态。
  组件化：逻辑分层清晰，易于维护。
  交互性：支持玩家名称修改和游戏重启。
  
*/
function App() {
  //

  // 存储玩家名称，可通过输入修改。
  const [players, setPlayers] = useState(PLAYERS);

  // 记录游戏回合的数组，每个回合包含 { square: { row, col }, player }。
  const [gameTurns, setGameTurns] = useState([]);

  // 当前活跃玩家（X 或 O）。
  const activePlayer = deriveActivePlayer(gameTurns);

  // 当前棋盘状态。
  const gameBoard = deriveGameBoard(gameTurns);

  // 获胜者名称（如果有）。
  const winner = deriveWinner(gameBoard, players);

  // 平局条件（9 步无胜者）。
  const hasDraw = gameTurns.length === 9 && !winner;

  /*
    @Note : 处理棋盘格子点击。
    根据当前回合确定玩家。
    添加新回合到 gameTurns（新回合在前）。
    效果：更新棋盘和活跃玩家。
  */
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  /*
    @Note : 重置游戏，清空 gameTurns。

  */
  function handleRestart() {
    setGameTurns([]);
  }

  /*
    @Note : 更新玩家名称。

    根据符号（X 或 O）更新 players 对象。
  */
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  /*
    @Note :

    玩家列表：两个 <Player> 组件，显示名称并高亮活跃玩家。
    游戏结束：当有胜者或平局时，显示 <GameOver>。
    棋盘：<GameBoard> 显示当前状态，点击格子触发 handleSelectSquare。
    日志：<Log> 显示回合记录。
  */
  return (
    <main>
      <div id="game-container">
        {/*  */}

        {/* 棋盘上面的，显示的两个玩家 : PLAYER1 X Edit    PLAYER2 O Edit */}

        {/*
        MJ_NOTE
        PLAYER 是函数组件 ：其内部的需要修改的部分，需要设置为参数，被外部设置； 
                          例如 PLAYER1/2, X/O, Edit/Save, 修改的名字保存；
                          前几个参数，是外层函数传给他，进行设置的，可以说是只读的 ；
                          后面的回调函数，是当子函数触发按钮时，执行父函数的某个功能 ；
        MJ_NOTE
        */}
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />

          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>

        {/* 游戏结束：显示对话框，没有虚化背景，只是弹出新的窗口，加上透明度 . */}
        {/* 新的窗口可直接覆盖？ MJ_NOTE  */}
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}

        {/* 九宫格棋盘 ： */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>

      {/* 棋盘下面的步数记录 : */}
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
