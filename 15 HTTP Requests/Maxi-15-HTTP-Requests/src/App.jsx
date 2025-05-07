import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";

/*
  @Brief :

  @Note :
  
*/
function App() {
  //

  // MJ_NOTE
  // 一个可变的引用（ref），用于存储当前选中的待删除地点。
  // 使用 useRef 可以确保其值在渲染间持久存在，且不会触发组件重新渲染。
  const selectedPlace = useRef();

  // 一个数组状态，保存用户选择的地点列表，初始值为空数组 []。
  const [userPlaces, setUserPlaces] = useState([]);

  // 布尔值状态，表示是否正在从服务器获取地点数据，初始值为 false。
  const [isFetching, setIsFetching] = useState(false);

  // 存储获取地点数据失败时的错误信息（例如 { message: "..." }），初始值为 undefined。
  const [error, setError] = useState();

  // 存储更新或删除地点失败时的错误信息，初始值为 undefined。
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  // 布尔值状态，控制删除确认模态框的显示与隐藏，初始值为 false。
  const [modalIsOpen, setModalIsOpen] = useState(false);

  /*
    @Note :
  
    在组件挂载时运行一次（依赖数组为空 []）。
    定义了一个异步函数 fetchPlaces，通过调用外部函数 fetchUserPlaces()
    （假设是一个 API 请求）获取用户地点数据。
    成功时更新 userPlaces，失败时设置 error，并通过 isFetching 管理加载状态。
  */
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchUserPlaces();

        setUserPlaces(places);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch user places." });
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

  /*
    @Note :
    打开删除确认模态框（setModalIsOpen(true)），
    并将待删除的地点存储到 selectedPlace.current 中。
  */
  function handleStartRemovePlace(place) {
    setModalIsOpen(true);

    selectedPlace.current = place; // MJ_NOTE
  }

  /*
    @Note :
    关闭删除确认模态框（setModalIsOpen(false)）。
  */
  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  /*
    @Note :
    用于添加新地点到 userPlaces。
    先通过 setUserPlaces 乐观更新状态：检查新地点是否已存在（通过 id 判断），
    如果不存在则将其添加到数组开头。
    然后调用 updateUserPlaces（假设是 API 函数）持久化更新。
    如果 API 调用失败，回滚 userPlaces 到之前状态，并设置 errorUpdatingPlaces。    
  */
  async function handleSelectPlace(selectedPlace) {
    // await updateUserPlaces([selectedPlace, ...userPlaces]);

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }

      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }

      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);

      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      });
    }
  }

  /*
    @Note :
      用于删除选中的地点。
      乐观更新 userPlaces，过滤掉与 selectedPlace.current.id 匹配的地点。
      调用 updateUserPlaces 持久化删除操作。
      如果 API 调用失败，回滚 userPlaces 并设置 errorUpdatingPlaces。
      最后关闭模态框。
      使用 useCallback 并依赖 userPlaces，确保函数在 userPlaces 变化时重新生成。

  */
  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);

        setErrorUpdatingPlaces({
          message: error.message || "Failed to delete place.",
        });
      }

      setModalIsOpen(false);
    },

    [userPlaces]
  );

  // 清除 errorUpdatingPlaces 状态，用于关闭错误模态框。
  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  /*
    @Note :
  
  */
  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>

      <main>
        {error && <Error title="An error occurred!" message={error.message} />}

        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
