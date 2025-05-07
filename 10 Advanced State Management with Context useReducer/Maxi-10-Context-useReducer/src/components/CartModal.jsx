import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import Cart from "./Cart.jsx";

/*
  @Brief :

  const CartModal = forwardRef(function Modal({ title, actions }, ref) { ... });

  forwardRef 是 React 提供的一个高阶函数，用于将 ref 从父组件传递到
  子组件的 DOM 元素或自定义方法。

  参数：
  { title, actions }：组件接收的 props，分别是模态框的标题和操作按钮。
  ref：父组件传入的 ref，用于控制模态框。

  作用：允许父组件通过 ref 调用 CartModal 暴露的方法（例如打开模态框）。


  @Note : 关键点分析

  为什么用 forwardRef 和 useImperativeHandle？
  默认情况下，ref 只能绑定到 DOM 元素或类组件。forwardRef 让函数组件也能接收 ref，而 useImperativeHandle 自定义了 ref 的功能（这里是 open 方法）。

  为什么用 createPortal？
  模态框通常需要渲染到 DOM 树的顶层（例如 <body> 下），以避免被父组件的样式或层级（z-index）影响。createPortal 实现了这一点。

  <dialog> 元素的作用
  HTML5 的 <dialog> 提供原生模态框支持，showModal() 打开模态框并添加背景遮罩，close() 关闭模态框。
  method="dialog" 让表单提交自动关闭模态框。

  不可变性
  这段代码没有直接修改状态，而是通过 DOM 操作（showModal）控制显示，适合模态框这种 UI 元素。
*/

/*
部分常用：使用 <dialog> 和 createPortal 的组合在轻量项目或特定场景中是常见的，
尤其是需要快速实现且不依赖外部库时。

不完全主流：forwardRef 和 useImperativeHandle 的命令式风格不如状态驱动的声明式方式流行，
且 <dialog> 的使用率低于自定义模态框或 UI 库。
*/

const CartModal = forwardRef(function Modal({ title, actions }, ref) {
  //
  // useRef 创建一个 ref 对象，用于引用 <dialog> 元素。
  // 初始值：dialog.current 初始为 undefined，在组件渲染后会绑定到 <dialog> DOM 节点。
  const dialog = useRef();

  // 自定义了通过 ref 暴露给父组件的接口。
  /*
  ref：父组件传入的 ref。
  回调函数：返回一个对象，定义了暴露的方法。

  父组件可以通过 ref.current.open() 控制模态框的显示，而不是直接操作 DOM。
  */
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },

      //close: () => dialog.current.close()
    };
  });

  // createPortal 是 React 提供的方法，用于将组件渲染到 DOM 树外的指定节点。
  /*
  第一个参数：要渲染的 JSX（模态框内容）。
  第二个参数：目标 DOM 节点（document.getElementById("modal")）。

  模态框结构：
  <dialog>：HTML5 原生对话框元素，支持 showModal() 和 close() 方法。
  id="modal"：元素的 ID。
  ref={dialog}：将 <dialog> 绑定到 dialog ref。
  <h2>{title}</h2>：显示传入的标题。
  <Cart />：一个子组件（假设是购物车内容）。
  <form method="dialog" id="modal-actions">{actions}</form>：
    method="dialog"：表示表单提交会关闭模态框（HTML5 特性）。
    {actions}：传入的操作按钮（例如 <button>Close</button>）。
  */
  return createPortal(
    <dialog id="modal" ref={dialog}>
      <h2>{title}</h2>

      <Cart />

      <form method="dialog" id="modal-actions">
        {actions}
      </form>
    </dialog>,

    document.getElementById("modal")
  );
});

export default CartModal;
