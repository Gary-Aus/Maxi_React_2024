import Header from "./components/Header.jsx";

import Examples from "./components/Examples.jsx";

import CoreConcepts from "./components/CoreConcepts.jsx";
// import { useState } from "react";

// import { CORE_CONCEPTS } from "./data.js";
// import { EXAMPLES } from "./data.js";

// import Header from "./components/Header.jsx";

// import CoreConcept from "./components/CoreConcept.jsx";

// import TabButton from "./components/TabButton.jsx";
// //import TabButtonB from "./components/TabButtonB.jsx";

function App() {
  return (
    <div>
      <Header />
      <main>
        <CoreConcepts />
        <Examples />
      </main>
    </div>
  );
}

export default App;
