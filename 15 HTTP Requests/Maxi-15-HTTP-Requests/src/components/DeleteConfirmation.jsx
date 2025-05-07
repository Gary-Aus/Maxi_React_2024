import { useEffect } from "react";

import ProgressBar from "./ProgressBar.jsx";

// 一个常量，值为 3000（毫秒），表示自动确认删除的倒计时时间（3 秒）。
const TIMER = 3000;

/*
  @Brief :
  DeleteConfirmation 是一个 React 函数组件，用于显示一个删除确认模态框。
  它提供了一个倒计时功能，如果用户在指定时间内（TIMER 定义为 3000 毫秒，即 3 秒）未作出选择，
  会自动触发确认删除操作。用户也可以手动点击“确认”或“取消”按钮来决定是否删除。

  onConfirm:
  一个函数类型的 prop，由父组件传入，在用户确认删除时调用（例如触发实际的删除逻辑）。
  onCancel:
  一个函数类型的 prop，由父组件传入，在用户取消删除时调用（例如关闭模态框）。

  @Note :
  
*/
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  //

  /*
    useEffect 实现倒计时:
    
    在组件挂载时运行，依赖于 onConfirm 函数。
    使用 setTimeout 设置一个定时器，在 TIMER（3 秒）后自动调用 onConfirm 函数，模拟用户确认删除。
    返回一个清理函数，使用 clearTimeout 清除定时器，确保在组件卸载或 onConfirm 变化时不会触发不必要的操作。
    依赖数组 [onConfirm] 确保当 onConfirm 函数引用变化时，重新设置定时器。
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>

      <p>Do you really want to remove this place?</p>

      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>

        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>

      <ProgressBar timer={TIMER} />
    </div>
  );
}
