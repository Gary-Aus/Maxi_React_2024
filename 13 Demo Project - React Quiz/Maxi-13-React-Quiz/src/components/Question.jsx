import { useState } from "react";

import QuestionTimer from "./QuestionTimer.jsx";
import Answers from "./Answers.jsx";
import QUESTIONS from "../questions.js";

/*
  @Brief :

  index：当前问题的索引，用于从 QUESTIONS 数组中获取对应问题数据。
  onSelectAnswer：回调函数，当用户选择答案并验证后调用，传入选中的答案。
  onSkipAnswer：回调函数，当计时器超时且未选择答案时调用。

  @Note :

  状态变化阶段：
  未选择：{ selectedAnswer: "", isCorrect: null }
  已选择未验证：{ selectedAnswer: "4", isCorrect: null }
  已验证：{ selectedAnswer: "4", isCorrect: true/false }

  点击 → 1 秒（显示“answered”）→ 验证 → 2 秒（显示“correct”/“wrong”）→ 结束。

*/

/*
  关键点分析

  状态流：
  未选择 → 选择（1 秒延迟）→ 验证（2 秒延迟）→ 结束。

  计时器动态调整：
  10 秒（等待选择）→ 1 秒（验证过渡）→ 2 秒（结果展示）。

  不可变性：
  使用 setAnswer 更新状态，符合 React 规范。

  与 Answers 联动：
  通过 answerState 和 selectedAnswer 控制答案按钮样式。
*/
export default function Question({ index, onSelectAnswer, onSkipAnswer }) {
  //

  // answer：对象状态，包含：
  // selectedAnswer：用户选择的答案（字符串），初始为空。
  // isCorrect：答案是否正确（布尔值或 null），初始为 null。
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  // 作用：根据答案状态动态调整计时器时长。

  // 默认：10 秒（未选择答案时）。
  let timer = 10000;

  // 用户选择答案后：1 秒（等待验证）。
  if (answer.selectedAnswer) {
    timer = 1000;
  }

  // 验证结果显示后：2 秒（展示正确/错误状态）。
  if (answer.isCorrect !== null) {
    timer = 2000;
  }

  /*
  @Note :

  */
  function handleSelectAnswer(answer) {
    //
    // 表示已选择但未验证。
    setAnswer({
      selectedAnswer: answer,
      isCorrect: null,
    });

    // 等待 1 秒（setTimeout），检查答案是否正确
    //         （QUESTIONS[index].answers[0] === answer）。
    // 更新状态为 { selectedAnswer: answer, isCorrect: true/false }。
    setTimeout(() => {
      setAnswer({
        selectedAnswer: answer,
        isCorrect: QUESTIONS[index].answers[0] === answer,
      });

      // 再等待 2 秒，调用 onSelectAnswer(answer)，通知父组件。
      setTimeout(() => {
        onSelectAnswer(answer);
      }, 2000);
    }, 1000);
  }

  // answerState：传递给 Answers 组件的状态，用于控制样式。
  let answerState = "";

  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered";
  }

  /*
    @Note :
    <QuestionTimer>：
    key={timer}：每次 timer 变化时重置计时器组件。
    timeout={timer}：设置倒计时时间。
    onTimeout：未选择答案时调用 onSkipAnswer，否则为 null（禁用超时）。
    mode={answerState}：可能用于计时器样式（如颜色）。

    <h2>：显示问题文本。

    <Answers>：渲染答案选项，传递状态和回调。
  */
  return (
    <div id="question">
      <QuestionTimer
        key={timer}
        timeout={timer}
        onTimeout={answer.selectedAnswer === "" ? onSkipAnswer : null}
        mode={answerState}
      />

      <h2>{QUESTIONS[index].text}</h2>

      <Answers
        answers={QUESTIONS[index].answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}

/*
当前 setTimeout 未清理，可能导致内存泄漏：  MJ_NOTE 

function handleSelectAnswer(answer) {
  setAnswer({ selectedAnswer: answer, isCorrect: null });

  const verifyTimer = setTimeout(() => {
    setAnswer({
      selectedAnswer: answer,
      isCorrect: QUESTIONS[index].answers[0] === answer,
    });

    const nextTimer = setTimeout(() => onSelectAnswer(answer), 2000);

    return () => clearTimeout(nextTimer);
  }, 1000);

  return () => clearTimeout(verifyTimer);
}

useEffect(() => handleSelectAnswer, []); // 添加 cleanup
*/
