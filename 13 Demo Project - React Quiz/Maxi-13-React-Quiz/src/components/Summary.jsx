import quizCompleteImg from "../assets/quiz-complete.png";
import QUESTIONS from "../questions.js";

/*
  @Brief :
    计算并显示跳过、正确和错误的答案比例
    列出所有问题及其答案，标示正确/错误/跳过状态

  @Note :

*/
export default function Summary({ userAnswers }) {
  //

  // 使用 filter 计算跳过的答案数量（null 表示跳过）
  const skippedAnswers = userAnswers.filter((answer) => answer === null);

  /*
    计算正确答案数量
    QUESTIONS 是外部定义的问题数组
    假设每个问题的第一个答案（answers[0]）是正确答案
    比较用户答案与正确答案
  */
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );

  /*
    计算跳过答案的百分比
    Math.round 四舍五入到整数
  */
  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  // 计算正确答案的百分比
  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );

  // 计算错误答案的百分比（总和为 100%）
  const wrongAnswersShare = 100 - skippedAnswersShare - correctAnswersShare;

  return (
    <div id="summary">
      <img src={quizCompleteImg} alt="Trophy icon" />

      <h2>Quiz Completed!</h2>

      {/* 
        统计展示
        使用三个 <p> 标签显示统计结果
        每个统计项分为数字（number 类）和描述（text 类）
      */}
      <div id="summary-stats">
        <p>
          <span className="number">{skippedAnswersShare}%</span>
          <span className="text">skipped</span>
        </p>

        <p>
          <span className="number">{correctAnswersShare}%</span>
          <span className="text">answered correctly</span>
        </p>

        <p>
          <span className="number">{wrongAnswersShare}%</span>
          <span className="text">answered incorrectly</span>
        </p>
      </div>

      {/* 
        答案详情列表

        使用有序列表 <ol> 显示每道题的详细信息
        map 遍历 userAnswers 数组

        样式逻辑：
        基础类 user-answer
        跳过（null）：添加 skipped
        正确（匹配正确答案）：添加 correct
        错误（非 null 且不正确）：添加 wrong

        每项内容：
        问题编号（index + 1）
        问题文本（QUESTIONS[index].text）
        用户答案（使用 ?? 运算符，若 answer 为 null 或 undefined，显示 "Skipped"）
      */}
      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = "user-answer";

          if (answer === null) {
            cssClass += " skipped";
          } else if (answer === QUESTIONS[index].answers[0]) {
            cssClass += " correct";
          } else {
            cssClass += " wrong";
          }

          return (
            <li key={index}>
              <h3>{index + 1}</h3>

              <p className="question">{QUESTIONS[index].text}</p>

              <p className={cssClass}>{answer ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
