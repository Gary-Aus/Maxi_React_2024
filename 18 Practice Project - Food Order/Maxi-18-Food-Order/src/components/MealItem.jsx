import { useContext } from "react";

import { currencyFormatter } from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";

/*
  @Brief :
MealItem 是一个 React 函数组件，用于展示单个餐品信息（图片、名称、价格、描述等），并提供“加入购物车”的交互功能。它通过 CartContext 管理购物车操作。

  @Note :
  
*/
export default function MealItem({ meal }) {
  //

  // 使用 React 的 useContext Hook 获取 CartContext（购物车上下文）。
  // CartContext 假设是一个全局状态管理工具，包含购物车数据和操作方法（如 addItem）。
  const cartCtx = useContext(CartContext);

  // 定义事件处理函数 handleAddMealToCart，当用户点击“Add to Cart”按钮时调用。
  // 调用 cartCtx.addItem(meal)，将当前餐品对象传递给购物车上下文。
  function handleAddMealToCart() {
    cartCtx.addItem(meal);
  }

  /*
    使用 <li> 表示列表项，className="meal-item" 应用卡片样式。
    <article> 组织内容，包含图片、文本和按钮。
  */
  return (
    <li className="meal-item">
      <article>
        <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />

        <div>
          <h3>{meal.name}</h3>

          <p className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </p>

          <p className="meal-item-description">{meal.description}</p>
        </div>

        <p className="meal-item-actions">
          <Button onClick={handleAddMealToCart}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}
