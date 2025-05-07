import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import Button from "./UI/Button.jsx";
import { currencyFormatter } from "../util/formatting.js";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

/*
  @Brief :
  Cart 是一个 React 函数组件，用于展示购物车内容。它显示购物车中的餐品列表、总价，
  并提供关闭购物车或前往结账的交互。组件通过 CartContext 管理购物车数据，
  通过 UserProgressContext 控制模态框状态。

  @Note :
  
*/
export default function Cart() {
  //

  // 提供购物车数据（items）和操作方法（addItem、removeItem）。
  const cartCtx = useContext(CartContext);

  /*
    管理界面状态（如显示购物车或结账模态框）。
    progress 表示当前状态（"cart" 或 "checkout"）。

    方法：
    hideCart：关闭购物车模态框。
    showCheckout：显示结账模态框。

  */
  const userProgressCtx = useContext(UserProgressContext);

  /*
    使用 reduce 计算购物车总金额（quantity * price 的和）。
    通过 currencyFormatter.format(cartTotal) 格式化显示（例如 $45.50）。
  */
  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  // 调用 userProgressCtx.hideCart()，关闭购物车模态框。
  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  // 调用 userProgressCtx.showCheckout()，切换到结账界面。
  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  /*
    @Note :
    使用 <Modal> 组件，className="cart" 应用购物车样式。
    open 由 progress === "cart" 控制，仅在购物车状态显示。
    onClose 仅在购物车状态下触发 handleCloseCart。
      
    使用 <ul> 渲染购物车项目。
    每个 <CartItem> 显示餐品信息，支持增减数量：
      key={item.id}：确保高效渲染。
      onIncrease：调用 addItem，增加餐品数量。
      onDecrease：调用 removeItem，减少或移除餐品。

    显示格式化的总金额。

    始终显示“Close”按钮。
    仅当购物车非空（items.length > 0）时显示“Go to Checkout”按钮。    
  */
  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === "cart"}
      onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>

      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>

      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>

      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>

        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
