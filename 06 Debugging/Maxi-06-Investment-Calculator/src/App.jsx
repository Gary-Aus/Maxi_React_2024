import { useState } from "react";

import Header from "./components/Header.jsx";
import UserInput from "./components/UserInput.jsx";
import Results from "./components/Results.jsx";

/*
  @Brief :

  @Note :

*/
function App() {
  const [userInput, setUserInput] = useState({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10,
  });

  /*
    @Note : MJ_NOTE  input 默认是字符串 ；

    +newValue : 将字符串转化为 number ；

  */
  function handleChange(inputIdentifier, newValue) {
    setUserInput((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: +newValue,
      };
    });
  }

  return (
    <>
      <Header />

      <UserInput userInput={userInput} onChange={handleChange} />

      <Results input={userInput} />
    </>
  );
}

export default App;
