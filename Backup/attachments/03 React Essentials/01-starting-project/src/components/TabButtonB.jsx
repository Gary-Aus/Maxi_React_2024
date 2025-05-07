export default function TabButtonB({ label }) {
  function handleB() {
    console.log("TB clicked!");
  }

  return (
    <li>
      <button onClick={handleB}>{label}</button>
    </li>
  );
}
