


import React, { useState, useEffect } from "react";
import { getSavedAnswer, saveAnswerText, saveCorrectAnswer } from "../utils/storage";
import "../styles/taskTextWithQuestions.css";

function TaskTextWithQuestions({ task, onUpdateProgress, resetSignal }) {
  const [answers, setAnswers] = useState([]);
  const [statusByQuestion, setStatusByQuestion] = useState([]);

  // При загрузке подгружаем ответы
  useEffect(() => {
    const savedAnswers = task.questions.map(
      (q) => getSavedAnswer(`${task.id}-${q.id}`) || ""
    );
    setAnswers(savedAnswers);

    const initialStatus = savedAnswers.map((ans) =>
      ans.trim() !== "" ? "correct" : "empty"
    );

    if (resetSignal) {
      setStatusByQuestion(new Array(task.questions.length).fill("reset"));
      setTimeout(() => setStatusByQuestion(initialStatus), 50);
    } else {
      setStatusByQuestion(initialStatus);
    }
  }, [task, resetSignal]);

  // Изменение одного ответа
  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Сохранение одного ответа
  const handleSaveSingle = (index) => {
    const newStatus = [...statusByQuestion];
    const qId = `${task.id}-${task.questions[index].id}`;
    const trimmed = answers[index].trim();

    saveAnswerText(qId, trimmed);

    if (trimmed !== "") {
      saveCorrectAnswer(qId);
      newStatus[index] = "correct";
    } else {
      newStatus[index] = "empty";
    }

    setStatusByQuestion(newStatus);
    if (onUpdateProgress) onUpdateProgress();
  };

  return (
    <div>
      <h1 className="task-heading">Страница {task.id}</h1>

      <div className="task-container">
        <div className="text-block">
          <p>{task.textBlock}</p>
        </div>

        <div className="questions-block">
          {task.questions.map((q, index) => (
            <div
              key={q.id}
              className={`question-item ${
                statusByQuestion[index] === "correct"
                  ? "question-correct"
                  : statusByQuestion[index] === "empty"
                  ? "question-empty"
                  : statusByQuestion[index] === "reset"
                  ? "question-reset"
                  : ""
              }`}
            >
              <div className="question-header">
                <div>
                    <strong>{q.id}.</strong>
                    {/* <p>{q.text}</p> */}
                    {q.audio && (
                    <audio controls 
                      src={process.env.PUBLIC_URL + q.audio}/>
                    )}
                    <br></br>
                    <strong>{q.text}</strong>
                </div>
                <button
                  className="save-single-button"
                  onClick={() => handleSaveSingle(index)}
                  title="Сохранить ответ"
                >
                  ✓
                </button>
              </div>

              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Ответ"
                className="answer-input"
              />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskTextWithQuestions;
