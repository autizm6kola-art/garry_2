

// import React, { useState, useEffect } from "react";
// import TaskTextWithQuestions from "./TaskTextWithQuestions";
// import BackToSelectionButton from "./BackToSelectionButton";
// import ProgressBar from "./ProgressBar";
// import { getSavedAnswer, saveAnswerText, saveCorrectAnswer } from "../utils/storage";

// const TasksPageWrapper = ({ allTasks, selectedRange, goBack }) => {
//   const [tasksInRange, setTasksInRange] = useState([]);
//   const [answeredCount, setAnsweredCount] = useState(0);
//   const [resetSignal, setResetSignal] = useState(false); // 🟩 сигнал сброса

//   useEffect(() => {
//     if (!allTasks.length || !selectedRange) return;
//     const [start, end] = selectedRange;
//     setTasksInRange(allTasks.filter((task) => task.id >= start && task.id <= end));
//   }, [allTasks, selectedRange]);

//   const updateProgress = () => {
//     if (!tasksInRange.length) return;

//     let count = 0;
//     tasksInRange.forEach((task) => {
//       task.questions.forEach((q) => {
//         const ans = getSavedAnswer(`${task.id}-${q.id}`);
//         if (ans && ans.trim() !== "") count++;
//       });
//     });
//     setAnsweredCount(count);
//   };

//   // Обновляем прогресс при первой загрузке и при сбросе
//   useEffect(() => {
//     updateProgress();
//   }, [tasksInRange, resetSignal]);

//   // 🧩 Сброс всех ответов
//   const handleResetAll = () => {
//     tasksInRange.forEach((task) => {
//       task.questions.forEach((q) => {
//         saveAnswerText(`${task.id}-${q.id}`, ""); // очищаем ответ
//         saveCorrectAnswer(`${task.id}-${q.id}`, false); // помечаем как неверный
//       });
//       saveCorrectAnswer(task.id, false); // помечаем страницу как невыполненную
//     });
//     setResetSignal(prev => !prev); // триггерим обновление дочерних компонентов и прогресса
//   };

//   if (!tasksInRange.length) return <div>Загрузка заданий...</div>;

//   const totalQuestions = tasksInRange.reduce(
//     (sum, task) => sum + task.questions.length,
//     0
//   );

//   return (
//     <div>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           background: "#fff",
//           padding: "10px 10px 1px 10px",
//           zIndex: 1000,
//         }}
//       >
//         <BackToSelectionButton onClick={goBack} />
//         <ProgressBar correct={answeredCount} total={totalQuestions} />
//         <div style={{ textAlign: "center", padding: "5px", fontFamily: "Arial", }}>
//           Отвечено на {answeredCount} из {totalQuestions} вопросов
//         </div>
//       </div>

//       <div>
//         {tasksInRange.map((task) => (
//           <TaskTextWithQuestions
//             key={task.id}
//             task={task}
//             onUpdateProgress={updateProgress}
//             resetSignal={resetSignal} // передаем сигнал дочернему компоненту
//           />
//         ))}
//       </div>

//       {/* 🟩 Кнопка сброса внизу */}
//       <div style={{ textAlign: "center", margin: "30px 0" }}>
//         <button
//           onClick={handleResetAll}
//           style={{
//             backgroundColor: "#ccc",
//             color: "#444",
//             border: "1px solid #aaa",
//             borderRadius: "6px",
//             padding: "8px 16px",
//             cursor: "pointer",
//             fontSize: "14px",
//           }}
//         >
//           Сбросить всё
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TasksPageWrapper;


import React, { useState, useEffect, useCallback } from "react";
import TaskTextWithQuestions from "./TaskTextWithQuestions";
import BackToSelectionButton from "./BackToSelectionButton";
import ProgressBar from "./ProgressBar";
import { getSavedAnswer, saveAnswerText, saveCorrectAnswer } from "../utils/storage";

const TasksPageWrapper = ({ allTasks, selectedRange, goBack }) => {
  const [tasksInRange, setTasksInRange] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [resetSignal, setResetSignal] = useState(false);

  useEffect(() => {
    if (!allTasks.length || !selectedRange) return;
    const [start, end] = selectedRange;
    setTasksInRange(allTasks.filter((task) => task.id >= start && task.id <= end));
  }, [allTasks, selectedRange]);

  const updateProgress = useCallback(() => {
    if (!tasksInRange.length) return;

    let count = 0;
    tasksInRange.forEach((task) => {
      task.questions.forEach((q) => {
        const ans = getSavedAnswer(`${task.id}-${q.id}`);
        if (ans && ans.trim() !== "") count++;
      });
    });

    setAnsweredCount(count);
  }, [tasksInRange]);

  useEffect(() => {
    updateProgress();
  }, [tasksInRange, resetSignal, updateProgress]);

  const handleResetAll = () => {
    tasksInRange.forEach((task) => {
      task.questions.forEach((q) => {
        saveAnswerText(`${task.id}-${q.id}`, "");
        saveCorrectAnswer(`${task.id}-${q.id}`, false);
      });
      saveCorrectAnswer(task.id, false);
    });

    setResetSignal((prev) => !prev);
  };

  if (!tasksInRange.length) return <div>Загрузка заданий...</div>;

  const totalQuestions = tasksInRange.reduce(
    (sum, task) => sum + task.questions.length,
    0
  );

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          padding: "10px 10px 1px 10px",
          zIndex: 1000,
        }}
      >
        <BackToSelectionButton onClick={goBack} />
        <ProgressBar correct={answeredCount} total={totalQuestions} />
        <div style={{ textAlign: "center", padding: "5px", fontFamily: "Arial" }}>
          Отвечено на {answeredCount} из {totalQuestions} вопросов
        </div>
      </div>

      <div>
        {tasksInRange.map((task) => (
          <TaskTextWithQuestions
            key={task.id}
            task={task}
            onUpdateProgress={updateProgress}
            resetSignal={resetSignal}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <button
          onClick={handleResetAll}
          style={{
            backgroundColor: "#ccc",
            color: "#444",
            border: "1px solid #aaa",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Сбросить всё
        </button>
      </div>
    </div>
  );
};

export default TasksPageWrapper;
