import { createContext, useReducer } from "react";

/*
  @Brief :
  使用 createContext 创建 CartContext，定义默认值：

  items：购物车餐品数组。
  addItem：添加餐品函数。
  removeItem：移除餐品函数。
  clearCart：清空购物车函数。

  默认值仅用于开发提示，实际由 Provider 提供。

  @Note :
  使用不可变更新（复制 items），确保 React 检测变化。
  返回新状态 { ...state, items: updatedItems }。  
*/

// MJ_NOTE 这个是定义 ； 在下面还有赋值 !!!

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

/*
  @Brief :
  管理购物车状态的纯函数，接收 state 和 action，返回新状态。

  @Note :
  
*/

/*
  MJ_NOTE 
  state 是当前的状态对象，表示购物车的最新数据。
  在 useReducer 中，state 是由 useReducer 管理的状态，初始值由 useReducer 的第二个参数提供。

  初始 state 是 { items: [] }，表示空的购物车。

  state 是一个对象，包含 items 数组，存储购物车中的餐品：

  {
    items: [
      { id: "1", name: "Pizza", price: 12.99, quantity: 2 },
      { id: "2", name: "Burger", price: 8.99, quantity: 1 },
    ]
  }

  MJ_NOTE
  state 是只读的，cartReducer 通过它读取当前购物车内容（如餐品数量、ID）。
  每次更新时，cartReducer 返回一个新 state 对象，React 用它更新组件。
*/

/*
  action 是一个对象，描述要执行的操作类型和相关数据。
  由 dispatch 函数（dispatchCartAction）触发，传递给 cartReducer。

  触发方式：
  dispatchCartAction({ type: "ADD_ITEM", item });
  dispatchCartAction({ type: "REMOVE_ITEM", id });
  dispatchCartAction({ type: "CLEAR_CART" });
  
  示例：
  { type: "ADD_ITEM", item: { id: "1", name: "Pizza", price: 12.99 } }
  { type: "REMOVE_ITEM", id: "1" }
  { type: "CLEAR_CART" }

  可以把 action 想象成一份“指令单”，描述了用户想对购物车做的操作。
  type 是指令的类别，额外字段（如 item、id）是执行指令需要的细节。  
*/

/*
示例
初始状态：state = { items: [] }

动作：dispatchCartAction({ type: "ADD_ITEM", item: { id: "1", name: "Pizza", price: 12.99 } })

处理：
cartReducer 检查 action.type 为 "ADD_ITEM"。
复制 state.items，添加 { ...item, quantity: 1 }。
返回新状态：{ items: [{ id: "1", name: "Pizza", price: 12.99, quantity: 1 }] }。

结果：cart 更新，组件显示新餐品。
*/
function cartReducer(state, action) {
  /*
    检查餐品是否已存在（通过 id）。
    存在：增加 quantity（数量 +1）。
    不存在：添加新餐品，初始 quantity 为 1。
  */
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  /*
    找到餐品（通过 id）。
    数量为 1：从数组移除。
    数量大于 1：减少 quantity（-1）。
  */
  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  // 清空 items 数组。
  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

/*
  @Brief :
  使用 useReducer 管理购物车状态，初始状态为 { items: [] }。

  定义操作函数：
    addItem：分发 ADD_ITEM 动作。
    removeItem：分发 REMOVE_ITEM 动作。
    clearCart：分发 CLEAR_CART 动作。

  创建 cartContext 对象，包含状态和方法。
  通过 <CartContext.Provider> 提供上下文，子组件可访问。

  @Note :
  children：被上下文包裹的组件树。

*/
export function CartContextProvider({ children }) {
  /*
    MJ_NOTE 
    state 是当前的状态对象，表示购物车的最新数据。
    在 useReducer 中，state 是由 useReducer 管理的状态，初始值由 useReducer 的第二个参数提供。

  */
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem, // 等同于 addItem : addItem ,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;

/*
新状态如何更新到 cart
React 的 useReducer Hook 是实现状态更新的关键。以下是具体流程：

a. 触发动作
组件通过 dispatchCartAction 发送动作：
function addItem(item) {
  dispatchCartAction({ type: "ADD_ITEM", item });
}
例如，addItem({ id: "1", name: "Pizza" }) 发送 { type: "ADD_ITEM", item: { id: "1", name: "Pizza" } }。

b. 调用 cartReducer
useReducer 收到动作后，调用 cartReducer(state, action)：
  state：当前的 cart 值（如 { items: [] }）。
  action：动作对象（如 { type: "ADD_ITEM", item: ... }）。

cartReducer 计算并返回新状态（如 { items: [{ id: "1", quantity: 1 }] }）。

c. React 更新 cart
useReducer 内部将 cartReducer 返回的新状态赋值给 cart：
  旧状态（cart）被新状态替换。
  例如：cart 从 { items: [] } 更新为 { items: [{ id: "1", quantity: 1 }] }。

React 检测到 cart 引用变化（新对象），触发组件重新渲染。 MJ_NOTE


d. 渲染更新
cart 更新后，CartContextProvider 重新运行：
const cartContext = {
  items: cart.items,
  addItem,
  removeItem,
  clearCart,
};

新 cartContext 传递给 CartContext.Provider，子组件（如 Cart、Checkout）接收更新后的 items，UI 显示最新购物车内容。


简单流程图
用户点击“添加餐品” → 调用 addItem。
addItem → dispatchCartAction({ type: "ADD_ITEM", item })。
useReducer → 调用 cartReducer(state, action)。
cartReducer → 返回新状态 { ...state, items: updatedItems }。
useReducer → 更新 cart 为新状态。
React → 检测 cart 变化，触发组件渲染，更新 UI。
*/
