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

      {/* Add lesson input */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter a lesson name"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addLesson}
          className="btn-primary"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add Lesson
        </button>
      </div>

      {/* Lesson list */}
      {lessons.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>No lessons added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              style={{
                backgroundColor: "#f4f4f4",
                padding: 14,
                borderRadius: 10,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600" }}>{lesson.name}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => goToBooks(lesson.id)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Go to Books
                </button>
                <button
                  onClick={() => removeLesson(lesson.id)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#e04848",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
