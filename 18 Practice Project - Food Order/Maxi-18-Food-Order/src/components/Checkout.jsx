import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

/*
  @Brief :


  @Note :
  用于 useHttp Hook，指定订单提交为 POST 请求，发送 JSON 数据。
*/
const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

/*
  @Brief :
  Checkout 是一个 React 函数组件，用于处理用户结账流程。
  它展示购物车总金额、收集用户信息、提交订单，并通过模态框显示结账界面。
  组件使用上下文（CartContext 和 UserProgressContext）管理购物车和界面状态，
  结合 useHttp Hook 处理订单提交。

  @Note :
  
*/
export default function Checkout() {
  //

  // 获取购物车数据（cartCtx.items）和方法（clearCart）。
  // items 假设包含餐品列表，如 [{ id, quantity, price, ... }, ...]。
  const cartCtx = useContext(CartContext);

  /*
    管理界面状态（如显示/隐藏结账模态框）。
    progress 表示当前状态，"checkout" 时显示模态框。
    方法 hideCheckout 关闭结账界面。
  */
  const userProgressCtx = useContext(UserProgressContext);

  /*
    向 http://localhost:3000/orders 发送 POST 请求。

    返回：
    data：订单提交成功的响应数据。
    isSending：请求是否进行中。
    error：请求失败的错误信息。
    sendRequest：触发请求的函数。
    clearData：清除请求数据（重置状态）。
  */
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  // 使用 reduce 计算购物车总金额（quantity * price 的和）。
  // 格式化后显示：currencyFormatter.format(cartTotal)（如 $45.50）。
  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  // 调用 userProgressCtx.hideCheckout()，关闭结账模态框。
  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  /*
    订单成功后：

    关闭模态框（hideCheckout）。
    清空购物车（clearCart）。
    重置请求数据（clearData）。
  */
  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  /*
    处理表单提交：

    阻止默认行为（event.preventDefault()）。
    使用 FormData 收集表单数据，转换为对象（customerData）。
    调用 sendRequest，发送 JSON 数据：
  */
  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries()); // { email: test@example.com }

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  // 默认显示“Close”和“Submit Order”按钮。
  // 请求中（isSending）时显示“Sending order data...”。
  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  /*
  @Note :
  订单成功（data 存在且无 error）时，显示成功提示模态框。

  显示结账表单，包含：
    总金额。
    输入字段（姓名、邮箱、地址等）。
    错误提示（如果 error 存在）。
    动作按钮（actions）。
  */
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  /*
  @Note :
  使用 <Modal> 组件，open 由 userProgressCtx.progress === "checkout" 控制。

  表单：
    包含多个 <Input> 组件（假设是自定义组件），收集用户信息。
    <div className="control-row"> 使邮编和城市并排。
    提交触发 handleSubmit。

  错误处理：
    {error && <Error title="Failed to submit order" message={error} />}。

  */
  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>

        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />

        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
