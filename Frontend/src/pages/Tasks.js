import React from "react";
import TaskBoard from "../components/TaskBoard"; // Import TaskBoard (3 columns with drag-drop)
// If you want the list view instead, import TaskList
// import TaskList from '../components/TaskList';

const Tasks = () => {
  return (
    <div>
      <TaskBoard />{" "}
    </div>
  );
};

export default Tasks;
