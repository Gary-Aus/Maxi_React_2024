import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/*
  @Brief :
  Modal 是一个通用的模态框组件，使用 HTML 的 <dialog> 元素实现，
  通过 React Portal 将内容渲染到指定的 DOM 节点。

  参数
  open: 布尔值，控制模态框的显示或隐藏。
  children: 模态框的内容，作为子节点传入。
  onClose: 函数，当模态框关闭时调用。

  @Note :
  
*/
function Modal({ open, children, onClose }) {
  //

  // 创建一个 dialog 引用，用于直接操作 <dialog> 元素的 showModal() 和 close() 方法。
  const dialog = useRef();

  // 根据 open 的值动态显示或关闭模态框：
  // 依赖数组 [open] 确保在 open 变化时重新执行。
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  /*
    将 <dialog> 渲染到 document.getElementById("modal") 指定的 DOM 节点，
    避免模态框受父组件的 CSS 或层级影响。

    使用 className="modal" 设置样式。
    ref={dialog} 绑定引用。
    onClose={onClose} 监听原生的 close 事件（例如用户点击 ESC 键关闭时触发）。
    仅当 open 为 true 时渲染 children，否则渲染 null。    
  */

  /*
    特点
    使用原生 <dialog> 元素，支持浏览器内置的模态框功能（如 ESC 关闭）。
    通过 Portal 实现灵活的 DOM 定位。
  */
  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
