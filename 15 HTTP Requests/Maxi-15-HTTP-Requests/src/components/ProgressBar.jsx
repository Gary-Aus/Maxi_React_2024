import { useState, useEffect } from "react";

/*
  @Brief :
  ProgressBar 是一个进度条组件，使用 HTML 的 <progress> 元素展示倒计时进度。

  timer: 数字，倒计时的总时间（以毫秒为单位）。

  @Note :
  
*/
export default function ProgressBar({ timer }) {
  //

  // 表示剩余时间，初始值为 timer。
  const [remainingTime, setRemainingTime] = useState(timer);

  /*
    设置一个定时器 setInterval，每 10 毫秒减少 remainingTime 的值（步长为 10）。
    返回清理函数 clearInterval，在组件卸载时清除定时器。
    依赖数组为空 []，表示只在挂载时运行一次。
  */
  useEffect(() => {
    //
    // 如果 timer prop 改变，remainingTime 不会重置，导致进度条行为异常。
    //setRemainingTime(timer); // 重置剩余时间

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 10);

      // 当 remainingTime 变为负值时，<progress> 不会自动停止显示。
      // setRemainingTime((prevTime) => Math.max(prevTime - 10, 0));
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}
