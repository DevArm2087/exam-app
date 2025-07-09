import React, { useState, useEffect } from "react";

export default function Results() {
  const [examResultsList, setExamResultsList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("examResultsList");
    setExamResultsList(saved ? JSON.parse(saved) : []);
  }, []);

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      setExamResultsList((prev) => {
        const newList = [...prev];
        newList.splice(index, 1);
        localStorage.setItem("examResultsList", JSON.stringify(newList));
        return newList;
      });
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  if (examResultsList.length === 0) {
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
          textAlign: "center",
          direction: "rtl",
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
        <h2>No exams taken yet.</h2>
      </div>
    );
  }

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
        direction: "rtl",
        fontFamily: "Vazirmatn, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Exam Results</h1>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        {examResultsList.map((result, i) => (
          <li
            key={result.timestamp}
            style={{
              border: "1px solid #ccc",
              borderRadius: 12,
              marginBottom: 16,
              padding: "1rem 1.2rem 1.6rem 1.2rem",
              backgroundColor: "var(--color-bg-secondary)",
              boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
              userSelect: "none",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            aria-expanded={expandedIndex === i}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setExpandedIndex(expandedIndex === i ? null : i);
              }
            }}
          >
            {/* Summary with delete button */}
            <div
              className="result-summary"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "var(--color-primary)",
                userSelect: "none",
              }}
            >
              <span>{result.examTitle || `Exam ${i + 1}`}</span>
              <span>{result.results.percentage} %</span>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(i);
                }}
                aria-label={`Delete exam result ${i + 1}`}
                style={{
                  backgroundColor: "var(--color-danger)",
                  color: "white",
                  border: "none",
                  borderRadius: 16,
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e53935")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-danger)")
                }
              >
                Delete
              </button>
            </div>

            {/* Short info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                color: "var(--color-text)",
                marginTop: "0.3rem",
                fontWeight: "600",
                userSelect: "none",
              }}
            >
              <span>Correct: {result.results.correctCount}</span>
              <span>Wrong: {result.results.wrongCount}</span>
              <span>Not Answered: {result.results.notAnswered}</span>
              <span>{new Date(result.timestamp).toLocaleString("en-US")}</span>
            </div>

            {/* Details */}
            {expandedIndex === i && (
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text)",
                  textAlign: "right",
                  userSelect: "text",
                }}
              >
                <p>Total Questions: {result.numQuestions}</p>
                <p>Negative Points: {result.results.negativePoints}</p>
                <p>Final Correct: {result.results.finalCorrect}</p>

                <h4 style={{ marginTop: "1rem" }}>Options per Question:</h4>
                {[...Array(result.numQuestions)].map((_, idx) => {
                  const qId = idx + 1;
                  const userChoice = result.answers[qId];
                  const correctChoice = result.correctAnswers[qId];
                  const numOptions = result.numOptions;

                  return (
                    <div
                      key={qId}
                      style={{
                        marginBottom: "0.5rem",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "0.3rem",
                      }}
                    >
                      <p>
                        <strong>Question {qId}:</strong>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                        }}
                      >
                        {[...Array(numOptions)].map((_, idx) => {
                          const isUserChoice = userChoice === idx;
                          const isCorrect = correctChoice === idx;
                          let bgColor = "";
                          if (isUserChoice && isCorrect) bgColor = "#4CAF50";
                          else if (isUserChoice && !isCorrect) bgColor = "#F44336";
                          else if (!isUserChoice && isCorrect) bgColor = "#2196F3";
                          else bgColor = "#eee";

                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: bgColor,
                                borderRadius: "6px",
                                minWidth: "70px",
                                textAlign: "center",
                                color: bgColor === "#eee" ? "#333" : "#fff",
                                fontWeight: isCorrect ? "bold" : "normal",
                                marginLeft: "0.5rem",
                                userSelect: "none",
                              }}
                            >
                              Option {idx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>

      <style>{`
        @media (max-width: 768px) {
          .result-summary {
            font-size: 1rem !important;
            gap: 8px !important;
          }

          .result-summary span {
            white-space: nowrap;
          }

          .btn-delete {
            padding: 5px 12px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
