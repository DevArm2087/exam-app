import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Exam from "./pages/Exam";
import Results from "./pages/Results";
import AnswerSheet from "./pages/AnswerSheet";  // اضافه کردن صفحه پاسخبرگ

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [selectedLesson, setSelectedLesson] = useState(() => {
    return localStorage.getItem("selectedLesson") || null;
  });

  const [selectedBook, setSelectedBook] = useState(() => {
    return localStorage.getItem("selectedBook") || null;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty("--color-bg", "#121212");
      root.style.setProperty("--color-text", "#e0e0e0");
      root.style.setProperty("--color-primary", "#bb86fc");
      root.style.setProperty("--color-primary-light", "#d3bafe");
      root.style.setProperty("--color-danger", "#cf6679");
      root.style.setProperty("--color-bg-secondary", "#1f1f1f");
    } else {
      root.style.setProperty("--color-bg", "#fefefe");
      root.style.setProperty("--color-text", "#222");
      root.style.setProperty("--color-primary", "#6200ee");
      root.style.setProperty("--color-primary-light", "#9d46ff");
      root.style.setProperty("--color-danger", "#b00020");
      root.style.setProperty("--color-bg-secondary", "#ffffff");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSelectLesson = (lessonId) => {
    setSelectedLesson(lessonId);
    localStorage.setItem("selectedLesson", lessonId);
    setSelectedBook(null);
    localStorage.removeItem("selectedBook");
  };

  const handleSelectBook = (bookId) => {
    setSelectedBook(bookId);
    localStorage.setItem("selectedBook", bookId);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <Router>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Home onSelectLesson={handleSelectLesson} selectedLesson={selectedLesson} />}
          />
          <Route
            path="/books"
            element={
              selectedLesson ? (
                <Books
                  selectedBook={selectedBook}
                  onSelectBook={handleSelectBook}
                  selectedLesson={selectedLesson}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/exam"
            element={
              selectedLesson && selectedBook ? (
                <Exam lessonId={selectedLesson} bookId={selectedBook} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/exam-quick" element={<Exam />} />
          <Route path="/results" element={<Results />} />
          <Route path="/answer-sheet" element={<AnswerSheet />} />  {/* این روت اضافه شده */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">© 2025 My Exam App</footer>
    </Router>
  );
}
