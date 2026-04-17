

import React, { useEffect, useState } from "react";
import TasksPageWrapper from "./components/TasksPageWrapper";
import MenuPage from "./components/MenuPage";

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [currentPage, setCurrentPage] = useState("menu");

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/tasks_garry.json")
      .then(res => res.json())
      .then(data => setAllTasks(data))
      .catch(console.error);
  }, []);

  const handleSelectRange = (range) => {
    setSelectedRange(range);
    setCurrentPage("tasks");
  };

  const goBack = () => {
    setCurrentPage("menu");
  };

  return (
    <div>
      {currentPage === "menu" && (
        <MenuPage allTasks={allTasks} onSelectRange={handleSelectRange} />
      )}

      {currentPage === "tasks" && (
        <TasksPageWrapper
          allTasks={allTasks}
          selectedRange={selectedRange}
          goBack={goBack}
        />
      )}
    </div>
  );
}

export default App;
