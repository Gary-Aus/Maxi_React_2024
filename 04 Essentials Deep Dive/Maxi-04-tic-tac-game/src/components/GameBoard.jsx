/*
  @Brief :
  渲染一个 3x3 的棋盘界面，每个格子是一个可点击的按钮，
  显示玩家的符号（X 或 O），并在点击时触发回调函数。

  @param onSelectSquare ：
  当用户点击某个格子时调用的回调函数，
  传递格子的行索引（rowIndex）和列索引（colIndex）。

  示例调用：onSelectSquare(1, 2) 表示点击第 1 行、第 2 列的格子。

  @param board ：
  二维数组（3x3）
  表示当前棋盘状态，每个元素是 null（空）、"X" 或 "O"。
  动态计算的棋盘状态。

  @Note :

  
*/
export default function GameBoard({ onSelectSquare, board }) {
  /*
  1. 外层 <ol id="game-board">
  作为棋盘的根容器，包含三行格子。使用 Flexbox 布局，垂直排列三行。

  2. 外层 map：渲染行
{board.map((row, rowIndex) => (
  <li key={rowIndex}>
数据源：board（二维数组）
循环变量：
row：当前行的数组（如 [null, null, null]）。
rowIndex：行索引（0、1、2）。
返回：每个 row 渲染为一个 <li> 元素。
<li> 的作用：
表示棋盘的一行。
key={rowIndex}：React 要求列表项有唯一 key，这里使用行索引。
结果：生成 3 个 <li>，分别对应棋盘的 3 行。

3. 内层 <ol>：每行的列容器
作为每行的子容器，包含该行的三个格子。
使用 Flexbox 水平排列三个格子。

4. 内层 map：渲染列（格子）
数据源：row（当前行的数组）
循环变量：
playerSymbol：格子的值（null、"X" 或 "O"）。
colIndex：列索引（0、1、2）。
返回：每个格子渲染为一个 <li> 元素。
<li> 的作用：
表示棋盘的一个格子。
key={colIndex}：唯一标识列。

5. 按钮 <button>：格子的交互元素

属性：
onClick={() => onSelectSquare(rowIndex, colIndex)}：
点击时调用 onSelectSquare，传递当前格子的行列索引。
使用箭头函数避免立即执行，确保点击时才触发。
disabled={playerSymbol !== null}：
条件：如果格子已有符号（X 或 O），按钮禁用。
逻辑：playerSymbol !== null 为 true 时，disabled 为 true，按钮不可点击。
作用：防止重复点击已填充的格子。
内容：{playerSymbol}
显示格子的值：null（空）、"X" 或 "O"。
如果是 null，按钮显示为空。


  */

  /*
渲染过程：
外层 map 遍历 board，生成 3 个 <li>（行）。
内层 map 遍历每行，生成 3 个 <li>（格子）。
每个格子是一个 <button>，显示 playerSymbol，并绑定点击事件。
*/
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

/*

示例运行
假设 board 是：
[
  ["X", null, "O"],
  [null, "X", null],
  ["O", null, null]
]

渲染结果：
第一行：<button>X</button>（禁用）、<button></button>（可点击）、<button>O</button>（禁用）。
第二行：<button></button>（可点击）、<button>X</button>（禁用）、<button></button>（可点击）。
第三行：<button>O</button>（禁用）、<button></button>（可点击）、<button></button>（可点击）。
点击行为：
点击空按钮（如 [0, 1]），调用 onSelectSquare(0, 1)。


*/

/*
优点与设计意图
组件化：
GameBoard 只负责渲染和传递点击事件，逻辑由父组件处理，符合 React 的单向数据流。
可复用性：
通过 board 和 onSelectSquare 参数，组件可适配不同状态和交互。
用户体验：
禁用已填充格子，防止无效操作。


总结
功能：渲染 3x3 棋盘，每个格子是按钮，显示符号并处理点击。
结构：嵌套 <ol> 和 <li>，通过双重 map 遍历 board。
交互：未填充格子可点击，已填充格子禁用。
依赖：board 提供状态，onSelectSquare 处理逻辑。
*/

/*  简化后的代码

export default function GameBoard({ onSelectSquare, board }) {
  return (
    <div id="game-board">
      {board.map((row, rowIndex) =>
        row.map((playerSymbol, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onSelectSquare(rowIndex, colIndex)}
            disabled={playerSymbol !== null}
          >
            {playerSymbol}
          </button>
        ))
      )}
    </div>
  );
}
*/
