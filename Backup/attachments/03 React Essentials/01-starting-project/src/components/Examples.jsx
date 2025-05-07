import { useState } from "react";
import { EXAMPLES } from "../data.js";
//import TabButton from "./components/TabButton.jsx";
import TabButton from "./TabButton.jsx";

export default function Examples() {
  const [selectedTopic, setSelectedTopic] = useState(); // "app click button"

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton); // !!!!!!!!!

    //console.log(selectedTopic);
  }

  let tabContent = <p>Please select a topic!</p>;

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic].title}</h3>
        <p>{EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    ); // mj_note : 使用 () !
  }

  return (
    <section id="examples">
      <h2>Examples</h2>
      {/* <menu>
      <TabButton onSelect={() => handleSelect("components")}>
        Components
      </TabButton>
      <TabButton onSelect={() => handleSelect("jsx")}>JSX</TabButton>
      <TabButton onSelect={() => handleSelect("props")}>Props</TabButton>
      <TabButton onSelect={() => handleSelect("state")}>State</TabButton>
    </menu> */}

      <menu>
        <TabButton onSelect={() => handleSelect("components")}>
          Components dfsd
        </TabButton>
        {/* <TabButtonB label="Components"></TabButtonB> */}
        <TabButton onSelect={() => handleSelect("jsx")}>JSX</TabButton>
        <TabButton onSelect={() => handleSelect("props")}>Props</TabButton>
        <TabButton onSelect={() => handleSelect("state")}>State</TabButton>

        {/* <TabButtonB label="JSX" />
<TabButtonB label="Props" />
<TabButtonB label="State" /> */}
      </menu>
      {tabContent}
    </section>
  );
}
