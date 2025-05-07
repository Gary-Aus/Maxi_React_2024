import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/*
  @Brief :


  @Note :
  
*/
export default function Modal({ children, open, onClose, className = "" }) {
  const dialog = useRef();

  /* MJ_NOTE 

    React 检测 [open] 变化（true → false）。
    先运行清理函数：modal.close()（关闭模态框）。
    再运行主函数：if (open) { modal.showModal(); }（因 open=false，不执行）。

    useEffect 内部逻辑（清理 + 主函数）运行。
    组件本身不因 useEffect 而再次运行。

    渲染与副作用分离：
      组件渲染生成 UI（虚拟 DOM），由 props/state 驱动。
      useEffect 处理副作用（如 DOM 操作、订阅），由依赖项控制。

    效率：React 只在需要时运行 useEffect（依赖变化），避免重复运行整个组件，优化性能。
    独立性：useEffect 的运行是局部的，不会触发组件函数重新调用。    
  */
  useEffect(() => {
    const modal = dialog.current;

    if (open) {
      modal.showModal();
    }

    return () => modal.close();
  }, [open]);

  /*
    ref={dialog}：通过 useRef 获取 <dialog> DOM 节点，允许调用 showModal 和 close。
    onClose={onClose}：绑定 onClose prop，处理关闭时的回调（如通知父组件）。

  */
  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
