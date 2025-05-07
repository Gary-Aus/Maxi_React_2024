import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

/*
  @Brief :
  AvailablePlaces 是一个 React 函数组件，用于显示可供用户选择的地点列表。
  它通过异步请求获取地点数据，并根据用户当前的地理位置对地点进行排序后展示。
  用户可以通过 onSelectPlace 回调选择某个地点。

  onSelectPlace:
  一个函数类型的 prop，允许父组件（例如 App 组件）接收用户选择的地点。
  通常用于将选中的地点添加到用户的个人列表中。
    
  @Note :
  
  地理位置排序：通过浏览器地理位置 API 获取用户位置，并对地点按距离排序，提供更个性化的体验。
  异步加载：使用 isFetching 状态管理加载过程，确保用户在数据获取时看到加载提示。
  错误处理：优雅地处理 API 或地理位置获取失败的情况，显示用户友好的错误信息。
  可复用性：通过 Places 组件展示数据，保持代码模块化。

*/
export default function AvailablePlaces({ onSelectPlace }) {
  //

  // 布尔值状态，表示是否正在从服务器获取地点数据，初始值为 false。
  const [isFetching, setIsFetching] = useState(false);

  // 数组状态，存储可用的地点列表，初始值为空数组 []。
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // 存储获取地点数据失败时的错误信息（例如 { message: "..." }），初始值为 undefined。
  const [error, setError] = useState();

  /*
    获取和排序地点:

    在组件挂载时运行一次（依赖数组为空 []）。
    
    定义了一个异步函数 fetchPlaces，执行以下步骤：
    设置 isFetching 为 true，表示正在加载。
    调用外部函数 fetchAvailablePlaces()（假设是一个 API 请求）获取可用地点数据。
    使用浏览器的 navigator.geolocation.getCurrentPosition 获取用户的当前地理位置（纬度和经度）。
    使用 sortPlacesByDistance 函数（假设是外部工具函数）根据用户位置对地点进行排序。
    将排序后的地点存储到 availablePlaces 中，并将 isFetching 设置为 false。
    如果发生错误（例如 API 请求失败或地理位置获取失败），设置 error 状态并停止加载。
    
    整个流程是异步的，确保 UI 在数据加载时能提供反馈。    
  */
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        // MJ_NOTE await 等待 fetchAvailablePlaces 返回的 Promise 解析。 MJ_NOTE
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          setAvailablePlaces(sortedPlaces);

          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });

        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  /*
    地点展示:

    如果没有错误，渲染 Places 组件，传递以下 props：
    
    title: 固定为 "Available Places"。
    places: 当前的 availablePlaces 数组。
    isLoading: 根据 isFetching 显示加载状态。
    loadingText: 加载时的提示文字（"Fetching place data..."）。
    fallbackText: 如果 places 为空时的提示文字（"No places available."）。
    onSelectPlace: 父组件传入的回调函数，用于处理用户选择地点的事件。

  */

  /*
    MJ_NOTE
    异步读取数据的操作，第一次渲染，先绘制 loading 的状态或文字，
    等待远程的数据收到反馈后，再渲染一次数据 ；
  */
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
