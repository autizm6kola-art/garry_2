

// export default MenuPage;

import React, { useEffect, useState, useCallback } from "react";
import { generateRanges } from "../utils/utils";
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";
import { getSavedAnswer, clearAllAnswers } from "../utils/storage";
import "../styles/menuPage.css";
import BackupControls from './BackupControls';

function MenuPage({ allTasks, onSelectRange }) {
  const [ranges, setRanges] = useState([]);
  const [progressByRange, setProgressByRange] = useState({});
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Генерация диапазонов при загрузке
  useEffect(() => {
    if (!allTasks.length) return;

    const generated = generateRanges(allTasks, 5);
    setRanges(generated);

    const allQs = allTasks.reduce((sum, task) => sum + task.questions.length, 0);
    setTotalQuestions(allQs);
  }, [allTasks]);

  // Подсчёт прогресса (обернули в useCallback)
  const calculateProgress = useCallback(() => {
    if (!ranges.length) return;

    const progress = {};
    let answeredCount = 0;

    ranges.forEach((range) => {
      let answeredInRange = 0;
      let totalInRange = 0;

      range.taskIds.forEach((taskId) => {
        const task = allTasks.find((t) => t.id === taskId);
        if (!task) return;

        totalInRange += task.questions.length;

        const answeredQuestions = task.questions.filter((q) => {
          const ans = getSavedAnswer(`${task.id}-${q.id}`);
          return ans && ans.trim() !== "";
        }).length;

        answeredInRange += answeredQuestions;
      });

      const percent =
        totalInRange > 0 ? (answeredInRange / totalInRange) * 100 : 0;

      progress[range.index] = {
        answered: answeredInRange,
        total: totalInRange,
        percent,
      };

      answeredCount += answeredInRange;
    });

    setProgressByRange(progress);
    setTotalAnswered(answeredCount);
  }, [ranges, allTasks]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  if (!ranges.length) return <div>Загрузка меню...</div>;

  return (
    <div className="menu-container">
      <BackButton />

      <h1 className="menu-title">Дары смерти</h1>

      <ProgressBar correct={totalAnswered} total={totalQuestions} />

      <p className="menu-progress-text">
        Отвечено на {totalAnswered} из {totalQuestions} вопросов
      </p>

      <div className="range-buttons-wrapper">
        {ranges.map((range) => {
          const progress = progressByRange[range.index];
          const from = range.taskIds[0];
          const to = range.taskIds[range.taskIds.length - 1];
          const label = `${range.index + 1}`;

          let buttonClass = "range-button";
          if (progress) {
            if (progress.percent === 100) buttonClass += " completed";
            else if (progress.percent > 0) buttonClass += " partial";
          }

          return (
            <button
              key={range.index}
              onClick={() => onSelectRange([from, to])}
              className={buttonClass}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        className="reset-button"
        onClick={() => {
          clearAllAnswers();
          calculateProgress();
        }}
      >
        Сбросить все ответы
      </button>

      <BackupControls />
    </div>
  );
}

export default MenuPage;
