import React, { useState, useEffect } from "react";
import { saveAnswerText, getSavedAnswer } from "../utils/storage";


const TasksPageText = ({ task, resetSignal }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // при сбросе компонента под новый диапазон загружаем ответы
    const savedAnswers = task.questions.map((q) => {
      const key = `${task.id}-${q.id}`;
      return getSavedAnswer(key) || "";
    });
    setAnswers(savedAnswers);
  }, [task, resetSignal]);

  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSaveAll = () => {
    answers.forEach((answer, i) => {
      const key = `${task.id}-${task.questions[i].id}`;
      saveAnswerText(key, answer.trim());
    });
    alert("Ответы сохранены!");
  };

  return (
    <div className="task-container">
      <h3>{task.title}</h3>
      {task.questions.map((q, i) => (
        <div key={q.id} className="question-block">
          <p>{q.text}</p>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSaveAll}>Сохранить ответы</button>
    </div>
  );
};

export default TasksPageText;
