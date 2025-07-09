import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState(() => {
    const saved = localStorage.getItem("lessons");
    return saved ? JSON.parse(saved) : [];
  });
  const [lessonName, setLessonName] = useState("");

  useEffect(() => {
    localStorage.setItem("lessons", JSON.stringify(lessons));
  }, [lessons]);

  const addLesson = () => {
    if (!lessonName.trim()) return alert("Please enter a lesson name.");
    if (lessons.some((l) => l.name.toLowerCase() === lessonName.trim().toLowerCase())) {
      return alert("This lesson already exists.");
    }
    setLessons([...lessons, { id: Date.now().toString(), name: lessonName.trim() }]);
    setLessonName("");
  };

  const removeLesson = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setLessons(lessons.filter((l) => l.id !== id));
    }
  };

  const goToBooks = (lessonId) => {
    localStorage.setItem("selectedLesson", lessonId);
    navigate("/books");
  };

  return (
    <div
      className="fade-in container"
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        padding: "1rem 1.5rem",
        backgroundColor: "var(--color-bg-secondary)",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        userSelect: "none",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Welcome to Your Exam Platform
      </h1>

 
      {/* Start exam button */}
      <button
        className="btn-primary"
        onClick={() => navigate("/exam-quick")}
        style={{
          display: "block",
          margin: "2rem auto 0",
          padding: "0.8rem 2.5rem",
          fontSize: "1.2rem",
          borderRadius: 24,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        Start Quick Exam
      </button>
    </div>
  );
}
