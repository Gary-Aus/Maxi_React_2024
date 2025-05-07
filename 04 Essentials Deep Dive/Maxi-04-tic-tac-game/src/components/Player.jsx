import { useState } from "react";

/*
  @Brief :

  @Note :

  
*/
export default function Player({
  initialName,
  symbol,
  isActive,
  onChangeName,
}) {
  // 用户名字需要保存 ；
  const [playerName, setPlayerName] = useState(initialName);

  // 是否在编辑状态 ：
  const [isEditing, setIsEditing] = useState(false);

  /*
    @Note :

  */
  function handleEditClick() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      onChangeName(symbol, playerName);
    }
  }

  /*
    @Note : event.target.value

  */
  function handleChange(event) {
    setPlayerName(event.target.value);
  }

  let editablePlayerName = <span className="player-name">{playerName}</span>;
  // let btnCaption = 'Edit';

  if (isEditing) {
    editablePlayerName = (
      <input type="text" required value={playerName} onChange={handleChange} />
    );
    // btnCaption = 'Save';
  }

  /*
    @Note :

  */
  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {editablePlayerName}

        <span className="player-symbol">{symbol}</span>
      </span>

      {/* MJ_NOTE : 编辑/保存按钮 ； */}
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
