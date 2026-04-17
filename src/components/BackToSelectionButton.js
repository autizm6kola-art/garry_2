// src/components/BackToSelectionButton.jsx
import React from 'react';
import '../styles/backButton.css'; // если стили хранятся там же

function BackToSelectionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      // className="back-link task-back-button"
    style={{
            backgroundColor: "#ccc",
            color: "#444",
            border: "1px solid #aaa",
            borderRadius: "20px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "Arial",
            marginBottom: "10px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

            
          }}
    >
      ← Назад к выбору
    </button>
  );
}

export default BackToSelectionButton;
