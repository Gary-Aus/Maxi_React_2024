import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig = {};

/*
  @Brief :
Meals 是一个 React 函数组件，负责从服务器获取餐品数据并展示为一个列表。它使用自定义 Hook useHttp 管理数据请求，支持加载状态和错误处理。

  @Note :
  
*/
export default function Meals() {
  //

  // useHttp 是一个自定义 Hook，用于处理 HTTP 请求。
  /*
    参数：
    "http://localhost:3000/meals": 请求的 API 地址。
    requestConfig: 请求配置对象（未展示，可能包含 method、headers 等）。
    []: 初始数据，空数组表示初始状态无数据。

    返回值：
    data（重命名为 loadedMeals）：请求成功的餐品数据（数组）。
    isLoading：布尔值，表示请求是否进行中。
    error：错误信息（如果请求失败）。
  */
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  // 当 isLoading 为 true 时，显示“Fetching meals...”提示。
  // 使用 className="center" 居中显示（对应 CSS 样式）。
  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  // 如果 error 有值，渲染 Error 组件，显示标题和错误消息。
  // 提前返回，阻止后续渲染。
  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  // 这段代码被注释，可能是因为 loadedMeals 默认是空数组（由 useHttp 的初始数据 [] 保证），无需显式检查空数据。
  // if (!data) {
  //   return <p>No meals found.</p>
  // }

  /*
    结构：
    渲染一个 <ul> 元素，ID 为 meals（对应 CSS 样式，如网格布局）。
    使用 loadedMeals.map 遍历餐品数组，生成 <MealItem> 组件。

    子组件：
    每个 <MealItem> 接收：
    key={meal.id}：唯一标识，用于 React 高效更新列表。
    meal={meal}：餐品对象，包含 id、标题、图片等信息。
  */
  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
