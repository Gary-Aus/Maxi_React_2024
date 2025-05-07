import { useState } from "react";

import { log } from "../../log.js";

function HistoryItem({ count }) {
  log("<HistoryItem /> rendered", 3);

  const [selected, setSelected] = useState(false);

  function handleClick() {
    setSelected((prevSelected) => !prevSelected);
  }

  return (
    <li onClick={handleClick} className={selected ? "selected" : undefined}>
      {count}
    </li>
  );
}

export default function CounterHistory({ history }) {
  log("<CounterHistory /> rendered", 2);

  return (
    <ol>
      {history.map((count) => (
        // 加 key ：则点击的历史值，会移动位置 ；
        <HistoryItem key={count.id} count={count.value} />

        // 不加 key ，历史值的位置不变 ：
        // <HistoryItem count={count.value} />
      ))}
    </ol>
  );
}

history.map((count) => <HistoryItem key={count.id} count={count.value} />);

history.map((count, index) => <HistoryItem key={index} count={count.value} />);
