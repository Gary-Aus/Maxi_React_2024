/*
  @Brief :
  Places 是一个展示地点列表的组件，支持加载状态、空状态和地点选择功能。

  title: 字符串，列表的标题。
  places: 数组，地点数据。
  fallbackText: 字符串，当没有地点时显示的提示文字。
  onSelectPlace: 函数，当用户选择地点时调用。
  isLoading: 布尔值，表示是否正在加载数据。
  loadingText: 字符串，加载时的提示文字。


  @Note :
  
  
*/
export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  isLoading,
  loadingText,
}) {
  console.log(places);

  return (
    <section className="places-category">
      <h2>{title}</h2>

      {isLoading && <p className="fallback-text">{loadingText}</p>}

      {!isLoading && places.length === 0 && (
        <p className="fallback-text">{fallbackText}</p>
      )}

      {!isLoading && places.length > 0 && (
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img
                  src={`http://localhost:3000/${place.image.src}`}
                  alt={place.image.alt}
                />

                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
