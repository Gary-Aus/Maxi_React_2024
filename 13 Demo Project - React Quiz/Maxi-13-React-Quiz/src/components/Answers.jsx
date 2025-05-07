import { useRef } from "react";

/*
  
  @Brief :
  answers：一个字符串数组，表示可供选择的答案选项（例如 ["A", "B", "C", "D"]）。

  selectedAnswer：当前选中的答案（字符串），可能是某个答案或 null。

  answerState：答案的状态，可能的值包括：
  ""（空字符串）：未回答。
  "answered"：已选择但未验证。
  "correct"：正确答案。
  "wrong"：错误答案。

  onSelect：回调函数，当用户点击答案按钮时调用，传入选中的答案。


  @Note :
  确保答案顺序在组件生命周期内只随机化一次，而不是每次渲染都重新排序（避免 UI 不一致）。

  @function :
  生成一组按钮 ；用于显示答案 。

*/
export default function Answers({
  answers,
  selectedAnswer,
  answerState,
  onSelect,
}) {
  //

  // 创建一个 shuffledAnswers ref 对象，用于存储随机排序后的答案数组。
  // useRef 的值在组件生命周期内持久存在，不会因重新渲染而重置。 MJ_NOTE
  const shuffledAnswers = useRef();

  // 仅在首次渲染时执行（因为 shuffledAnswers.current 初始为 undefined）。
  if (!shuffledAnswers.current) {
    // 创建一个 answers 的副本，避免直接修改传入的 props。
    shuffledAnswers.current = [...answers];

    // 使用 Fisher-Yates 洗牌算法的简化版，将数组随机排序。
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  /*
    @Note : MJ_NOTE 

    return (
      <ul id="answers">
        {shuffledAnswers.current.map((answer) => { ... })}
      </ul>
    );

    使用 <ul> 渲染一个答案列表。
    shuffledAnswers.current.map 遍历随机化的答案数组，生成每个答案的 <li>。

  */
  return (
    <ul id="answers">
      {shuffledAnswers.current.map((answer) => {
        //
        // 选中状态检查：检查当前答案是否是用户选中的答案。
        const isSelected = selectedAnswer === answer;

        // 动态 CSS 类 ：初始化按钮的 CSS 类名。
        let cssClass = "";

        // 如果状态是 "answered" 且该答案被选中，
        // 添加 "selected" 类（表示已选择但未验证）。
        if (answerState === "answered" && isSelected) {
          cssClass = "selected";
        }

        // 如果状态是 "correct" 或 "wrong" 且该答案被选中，
        // 添加对应的状态类（"correct" 或 "wrong"）。
        if (
          (answerState === "correct" || answerState === "wrong") &&
          isSelected
        ) {
          cssClass = answerState;
        }

        /*
          @Note :

          如果 answerState 不为空（即已回答），禁用按钮，防止重复选择。
        */
        return (
          <li key={answer} className="answer">
            <button
              onClick={() => onSelect(answer)}
              className={cssClass}
              disabled={answerState !== ""}
            >
              {answer}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
