import { useState, useEffect } from "react";

/*
  @Brief : 这是一个计时器组件，用于显示问题回答的剩余时间进度条。

  @Note :

  timeout: 总时长（毫秒）
  onTimeout: 超时时的回调函数
  mode: 进度条的样式类名

*/
export default function QuestionTimer({ timeout, onTimeout, mode }) {
  const [remainingTime, setRemainingTime] = useState(timeout);

  // 在组件挂载时设置一个一次性定时器
  useEffect(() => {
    console.log("SETTING TIMEOUT");

    // 超时控制 ：在指定时间后执行 onTimeout 回调
    const timer = setTimeout(onTimeout, timeout);

    // 在组件卸载时清除定时器 MJ_NOTE
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);

  // 进度更新 ：每隔100毫秒更新一次剩余时间
  useEffect(() => {
    console.log("SETTING INTERVAL");

    // 每100ms减少100ms的剩余时间
    // 使用函数式更新来确保状态更新的准确性
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    // 清理函数：在组件卸载时清除interval
    return () => {
      clearInterval(interval);
    };
  }, []);
  // 空依赖数组 []: 只在组件挂载时运行一次

  /*
    @Note ： 返回一个 HTML5 progress 元素

    max: 进度条最大值（总时长）
    value: 当前值（剩余时间）
    className: 通过 mode prop 控制样式
  */
  return (
    <progress
      id="question-time"
      max={timeout}
      value={remainingTime}
      className={mode}
    />
  );
}
