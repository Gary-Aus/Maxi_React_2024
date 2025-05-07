import { useState, useCallback } from "react";

import QUESTIONS from "../questions.js";
import Question from "./Question.jsx";
import Summary from "./Summary.jsx";

/*
  @Brief :
  Quiz 是一个函数组件，用于：

  跟踪用户答案
  显示当前问题
  处理答案选择和跳过
  在完成时显示总结


  @Note :

*/
export default function Quiz() {
  //

  // 管理用户答案数组
  const [userAnswers, setUserAnswers] = useState([]);

  // 派生状态 MJ_NOTE

  // 当前问题索引，由已回答的问题数决定
  const activeQuestionIndex = userAnswers.length;

  // 判断测验是否完成，比较当前索引与问题总数
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

  /*
    使用 useCallback 优化性能
    接受用户选择的答案
    将新答案追加到现有答案数组中
    空依赖数组表示函数只创建一次
  */
  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
  },
  []);

  /*
    使用 useCallback 优化
    调用 handleSelectAnswer 并传入 null 表示跳过
    依赖 handleSelectAnswer
  */
  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );

  // 条件渲染 MJ_NOTE
  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />;
  }

  /*
    未完成时渲染 Question 组件
    传递当前问题索引和处理函数
    使用 key 确保问题切换时组件重新渲染

    组件切换：通过 key 属性确保 Question 组件正确更新 MJ_NOTE 
  */
  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex}
        index={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
}
