import { useState } from "react";

import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";

/*
  @Brief :

  @Note :

  MJ_NOTE 
  在 React 中，使用 setProjectsState 更新状态时，必须返回一个新对象以触发重新渲染。
  ...prevState 确保了这一点，因为它创建了一个新对象。
*/
function App() {
  //

  // selectedProjectId ： 当前选中的项目 ；
  // projects : 数组，项目列表 ；
  // tasks    : 数组，项目里面的任务列表 ；
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
  });

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // 某个项目里面的任务 item ，增加 / 删除 ；

  /*
    @Note : 
    增加任务 item，需要写入 state ；

    浅拷贝（Shallow Copy）是指只复制对象的第一层属性。
    如果对象中包含嵌套的对象或数组（即引用类型），
    那么复制的只是这些嵌套对象的引用，而不是它们的内容。

    在这个例子中，...prevState 创建了一个新对象，
    但 prevState.projects 和 prevState.tasks（都是数组）
    只是被引用复制，而不是深层复制。

@Return
{
  selectedProjectId: prevState.selectedProjectId, // 基本类型，直接复制值
  projects: prevState.projects,                  // 数组，复制引用
  tasks: [newTask, ...prevState.tasks],          // 新数组，包含新任务和旧任务的浅拷贝
}

selectedProjectId 是基本类型（可能是 undefined、null 或数字），会被完整复制。
projects 是数组，...prevState 只是复制了它的引用，因此新对象中的 projects 仍然指向原来的数组。
tasks 虽然也被重新赋值，但 [newTask, ...prevState.tasks] 创建了一个新数组，
其中 newTask 是新对象，而 ...prevState.tasks 是对原 tasks 数组的浅拷贝。
  */

  /*
  tasks: [newTask, ...prevState.tasks]：
  在新对象中，tasks 属性被显式赋值，覆盖了从 ...prevState 复制过来的 tasks。

  [newTask, ...prevState.tasks] 创建一个新数组：
  newTask 是新添加的任务对象（例如 { text: "New task", projectId: 1, id: 0.2 }）。
  ...prevState.tasks 将原来的 tasks 数组中的所有元素展开并追加到新数组中。
  */

  /*
  最终，tasks: [newTask, ...prevState.tasks] 表示：
  
  创建一个新数组。
  把 newTask 放在数组开头。
  把 prevState.tasks 中的所有任务追加在后面。
  这个新数组会成为新状态中 tasks 属性的值。
  */

  /*
  代码中的 [newTask, ...prevState.tasks] 就是这个过程：

  newTask 是“写代码”。
  ...prevState.tasks 是把旧清单“买牛奶”抄过来。
  [ ] 是新纸，把两者组合起来。
  */

  /*
  为什么这样写？

  不可变性（Immutability）：
  React 要求状态更新时创建新对象，而不是修改旧对象。
  如果直接用 prevState.tasks.push(newTask)，会修改原数组，导致状态不可预测。
  [newTask, ...prevState.tasks] 创建一个新数组，保持了不可变性。

  添加新任务到开头：
  把 newTask 放在前面，旧任务跟在后面，形成一个“最新任务优先”的顺序。
  如果想要旧任务在前、新任务在后，可以写成 [...prevState.tasks, newTask]。
  
  浅拷贝特性：
  ...prevState.tasks 是对旧数组元素的浅拷贝，新数组中的任务对象仍然引用原来的对象。
  但因为这里只是添加新任务，不修改旧任务内容，所以浅拷贝已经足够。
  */
  function handleAddTask(text) {
    setProjectsState((prevState) => {
      const taskId = Math.random();
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: taskId,
      };

      return {
        ...prevState,
        tasks: [newTask, ...prevState.tasks], // 把 newTask 和展开后的 prevState.tasks 组合成一个新数组。
      };
    });
  }

  /*
    @Note : 
    删除任务 item，也需要修改 state ；
    
  */
  function handleDeleteTask(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== id),
      };
    });
  }

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // 修改项目的 id ； MJ_NOTE

  function handleSelectProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // 增加 / 删除项目 item ：

  function handleAddProject(projectData) {
    setProjectsState((prevState) => {
      const projectId = Math.random();

      const newProject = {
        ...projectData,
        id: projectId,
      };

      return {
        ...prevState,

        selectedProjectId: undefined,

        projects: [...prevState.projects, newProject],
      };
    });
  }

  function handleDeleteProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,

        projects: prevState.projects.filter(
          (project) => project.id !== prevState.selectedProjectId
        ),
      };
    });
  }

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // 增加 / 删除项目 item ：

  // MJ_NOTE : ???
  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );

  let content = (
    <SelectedProject
      project={selectedProject}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      tasks={projectsState.tasks}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  /*
    @Note :
  */
  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar
        onStartAddProject={handleStartAddProject}
        projects={projectsState.projects}
        onSelectProject={handleSelectProject}
        selectedProjectId={projectsState.selectedProjectId}
      />

      {content}
    </main>
  );
}

export default App;
