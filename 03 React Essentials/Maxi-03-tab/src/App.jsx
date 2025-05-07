import { useState } from "react";

import { CORE_CONCEPTS } from "./data.js";
import Header from "./components/Header/Header.jsx";
import CoreConcept from "./components/CoreConcept.jsx";
import TabButton from "./components/TabButton.jsx";
import { EXAMPLES } from "./data.js";

/*
  @Brief :

  @Note :

  设计要点

状态管理：
selectedTopic 控制选项卡内容，简单高效。

条件渲染：
根据 selectedTopic 动态切换 tabContent，直观易懂。

组件化：
将功能拆分为 <Header>、<CoreConcept>、<TabButton>，复用性强。

数据驱动：
使用外部数据（CORE_CONCEPTS 和 EXAMPLES）渲染内容，便于扩展。
  
*/

function App() {
  //

  // 状态变量，记录当前选中的选项卡（undefined 表示未选择）
  const [selectedTopic, setSelectedTopic] = useState();

  /*
    处理选项卡点击的函数，接收一个字符串（如 "components"），更新 selectedTopic。
  */
  function handleSelect(selectedButton) {
    // selectedButton => 'components', 'jsx', 'props', 'state'
    setSelectedTopic(selectedButton);
    // console.log(selectedTopic);
  }

  console.log("APP COMPONENT EXECUTING");

  // 动态内容变量，默认显示提示信息。 MJ_NOTE  MJ_NOTE
  let tabContent = <p>Please select a topic.</p>;

  // 如果 selectedTopic 有值（非 undefined）：
  // 从 EXAMPLES 中提取对应数据（如 EXAMPLES["components"]）。
  // 渲染标题（title）、描述（description）和代码（code）。

  // <pre> ? MJ_NOTE
  /*
  作用：<pre> 在你的代码中用于展示 EXAMPLES 中的代码片段，保留其格式。
  特性：预格式化文本，保留空格和换行，默认等宽字体。
  搭配：与 <code> 结合，提供语义和样式。
  场景：非常适合展示代码、文本块等需要精确排版的内容。
  */
  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTopic].title}</h3>

        <p>{EXAMPLES[selectedTopic].description}</p>

        <pre>
          <code>{EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    );
  }

  /*
  @Note :

  
  */
  return (
    <div>
      <Header />

      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>

          {/* 
          CORE_CONCEPTS : 包含多个对象的数组结构；外部导入的 ； 
          conceptItem   ：函数定义的参数 ；代表数组中的每一个元素 MJ_NOTE ;
                          因为使用了 map() ;

          CoreConcept   : 函数组件，外部导入的；包括图片，标题，描述 ；
          */}

          {/* 
          使用 map 遍历 CORE_CONCEPTS，渲染多个 <CoreConcept> 组件。
          key={conceptItem.title}：确保列表项有唯一标识。

          {...conceptItem}：将 conceptItem 的属性（如 title, description, image）
          解构传递给 <CoreConcept>。 MJ_NOTE
          */}
          <ul>
            {CORE_CONCEPTS.map((conceptItem) => (
              <CoreConcept key={conceptItem.title} {...conceptItem} />
            ))}
          </ul>
        </section>

        <section id="examples">
          <h2>Examples</h2>

          {/* <menu> 包含四个 <TabButton> */}

          {/* 
          Props：
          isSelected：布尔值，判断当前按钮是否选中（通过 selectedTopic === "xxx"）。
          onSelect：点击时调用 handleSelect，传入对应字符串。
          children：按钮的文本内容（如 “Components”）。
          */}
          <menu>
            <TabButton
              isSelected={selectedTopic === "components"}
              onSelect={() => handleSelect("components")}
            >
              Components
            </TabButton>

            <TabButton
              isSelected={selectedTopic === "jsx"}
              onSelect={() => handleSelect("jsx")}
            >
              JSX
            </TabButton>

            <TabButton
              isSelected={selectedTopic === "props"}
              onSelect={() => handleSelect("props")}
            >
              Props
            </TabButton>

            <TabButton
              isSelected={selectedTopic === "state"}
              onSelect={() => handleSelect("state")}
            >
              State
            </TabButton>
          </menu>

          {/* {tabContent}：动态渲染选项卡内容。 */}
          {tabContent}
        </section>
      </main>
    </div>
  );
}

export default App;
