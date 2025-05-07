export default function TabButton({ children, onSelect, isSelected }) {
  // document.querySelector('button').addEventListener('click',()=>{
  //   console.log("Button clicked!");
  // })

  // function handleClick() {
  //   console.log("tab button clicked!");
  // }

  return (
    <li>
      <button classNam={isSelected ? "active" : undefined} onClick={onSelect}>
        {children}
      </button>
    </li>
  );
}
