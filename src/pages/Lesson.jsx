import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("exam"); // "exam" or "notes"

  return (
    <div className="fade-in container">
      <h2>Lesson ID: {lessonId}</h2>

      <div className="tab-selector" style={{ marginBottom: "1rem" }}>
        <button
          className={activeTab === "exam" ? "tab active" : "tab"}
          onClick={() => setActiveTab("exam")}
        >
          Exams
        </button>
        <button
          className={activeTab === "notes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      {activeTab === "exam" && (
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate(`/exam/${lessonId}`)}
          >
            Manage Exams
          </button>
        </div>
      )}

      {activeTab === "notes" && (
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate(`/notes/${lessonId}`)}
          >
            Manage Notes
          </button>
        </div>
      )}
    </div>
  );
}
