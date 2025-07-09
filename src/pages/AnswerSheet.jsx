import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AnswerSheet({ darkMode }) {
  const [searchParams] = useSearchParams();
  const currentBookId = searchParams.get("book") || "no-book";

  const [numQuestions, setNumQuestions] = useState("");
  const [numOptions, setNumOptions] = useState("");

  const [answerSheets, setAnswerSheets] = useState(() => {
    const saved = localStorage.getItem("answerSheets");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editNumQuestions, setEditNumQuestions] = useState("");
  const [editNumOptions, setEditNumOptions] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("userAnswers");
    return saved ? JSON.parse(saved) : {};
  });

  // ذخیره تغییرات به localStorage
  useEffect(() => {
    localStorage.setItem("answerSheets", JSON.stringify(answerSheets));
  }, [answerSheets]);

  useEffect(() => {
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  // فیلتر جواب برگ ها فقط برای کتاب جاری
  const sheetsForCurrentBook = answerSheets.filter(
    (sheet) => sheet.bookId === currentBookId
  );

  // ساختن جواب برگ جدید و اتصالش به کتاب جاری
  const handleCreate = () => {
    const qCount = parseInt(numQuestions);
    const oCount = parseInt(numOptions);

    if (isNaN(qCount) || qCount <= 0) {
      alert("Please enter a valid number of questions");
      return;
    }
    if (isNaN(oCount) || oCount <= 1) {
      alert("Number of options must be greater than 1");
      return;
    }

    const newSheet = {
      id: Date.now().toString(),
      bookId: currentBookId, // مهم: اتصال به کتاب
      numQuestions: qCount,
      numOptions: oCount,
      questions: Array(qCount)
        .fill(null)
        .map(() => Array(oCount).fill("")),
    };

    setAnswerSheets([...answerSheets, newSheet]);
    setNumQuestions("");
    setNumOptions("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this answer sheet?")) {
      setAnswerSheets(answerSheets.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const startEdit = (sheet) => {
    setEditingId(sheet.id);
    setEditNumQuestions(sheet.numQuestions);
    setEditNumOptions(sheet.numOptions);
  };

  const saveEdit = (id) => {
    const qCount = parseInt(editNumQuestions);
    const oCount = parseInt(editNumOptions);

    if (isNaN(qCount) || qCount <= 0) {
      alert("Please enter a valid number of questions");
      return;
    }
    if (isNaN(oCount) || oCount <= 1) {
      alert("Number of options must be greater than 1");
      return;
    }

    setAnswerSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === id) {
          const newQuestions = Array(qCount)
            .fill(null)
            .map(() => Array(oCount).fill(""));
          return {
            ...sheet,
            numQuestions: qCount,
            numOptions: oCount,
            questions: newQuestions,
          };
        }
        return sheet;
      })
    );
    setEditingId(null);
  };

  const handleSelectAnswer = (sheetId, questionIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [sheetId]: {
        ...prev[sheetId],
        [questionIndex]: optionIndex,
      },
    }));
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: "1.5rem 2rem",
        backgroundColor: darkMode ? "#1e1e1e" : "var(--color-bg-secondary)",
        borderRadius: 16,
        boxShadow: darkMode
          ? "0 6px 18px rgba(255,255,255,0.1)"
          : "0 6px 18px rgba(0,0,0,0.12)",
        userSelect: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: darkMode ? "#ddd" : "var(--color-text)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, fontWeight: "700" }}>
        Create New Answer Sheet for Book: {currentBookId}
      </h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <input
          type="number"
          min={1}
          placeholder="Number of Questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          style={{
            flex: "1 1 140px",
            padding: "12px 16px",
            borderRadius: 10,
            border: `1.8px solid ${darkMode ? "#555" : "#aaa"}`,
            fontSize: 17,
            textAlign: "center",
            outline: "none",
            backgroundColor: darkMode ? "#2a2a2a" : "#fff",
            color: darkMode ? "#eee" : "#000",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = darkMode ? "#bb86fc" : "var(--color-primary)")
          }
          onBlur={(e) => (e.target.style.borderColor = darkMode ? "#555" : "#aaa")}
        />
        <input
          type="number"
          min={2}
          placeholder="Number of Options"
          value={numOptions}
          onChange={(e) => setNumOptions(e.target.value)}
          style={{
            flex: "1 1 140px",
            padding: "12px 16px",
            borderRadius: 10,
            border: `1.8px solid ${darkMode ? "#555" : "#aaa"}`,
            fontSize: 17,
            textAlign: "center",
            outline: "none",
            backgroundColor: darkMode ? "#2a2a2a" : "#fff",
            color: darkMode ? "#eee" : "#000",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = darkMode ? "#bb86fc" : "var(--color-primary)")
          }
          onBlur={(e) => (e.target.style.borderColor = darkMode ? "#555" : "#aaa")}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: "12px 28px",
            borderRadius: 28,
            fontSize: 18,
            cursor: "pointer",
            backgroundColor: darkMode ? "#bb86fc" : "var(--color-primary)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: darkMode
              ? "0 3px 10px #d3bafe"
              : "0 3px 10px var(--color-primary-light)",
            border: "none",
            userSelect: "none",
            flexShrink: 0,
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#d3bafe" : "var(--color-primary-light)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = darkMode ? "#bb86fc" : "var(--color-primary)")
          }
        >
          Create
        </button>
      </div>

      <hr style={{ marginBottom: 32, borderColor: darkMode ? "#444" : "#ddd" }} />

      <h3
        style={{
          marginBottom: 16,
          textAlign: "center",
          fontWeight: "700",
          fontSize: 22,
          color: darkMode ? "#eee" : "inherit",
        }}
      >
        Created Answer Sheets
      </h3>

      {sheetsForCurrentBook.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: darkMode ? "#999" : "#888",
          }}
        >
          No answer sheets created yet for this book.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sheetsForCurrentBook.map((sheet) => (
            <li
              key={sheet.id}
              style={{
                border: `1.5px solid ${darkMode ? "#555" : "#ccc"}`,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                backgroundColor: darkMode ? "#2a2a2a" : "var(--color-bg-secondary)",
                boxShadow: darkMode
                  ? "0 5px 14px rgba(187,134,252,0.25)"
                  : "0 5px 14px rgba(0,0,0,0.05)",
                userSelect: "none",
              }}
            >
              {editingId === sheet.id ? (
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="number"
                    min={1}
                    value={editNumQuestions}
                    onChange={(e) => setEditNumQuestions(e.target.value)}
                    placeholder="Number of Questions"
                    style={{
                      flex: "1 1 140px",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${darkMode ? "#555" : "#aaa"}`,
                      fontSize: 16,
                      textAlign: "center",
                      outline: "none",
                      backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                      color: darkMode ? "#eee" : "#000",
                    }}
                  />
                  <input
                    type="number"
                    min={2}
                    value={editNumOptions}
                    onChange={(e) => setEditNumOptions(e.target.value)}
                    placeholder="Number of Options"
                    style={{
                      flex: "1 1 140px",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${darkMode ? "#555" : "#aaa"}`,
                      fontSize: 16,
                      textAlign: "center",
                      outline: "none",
                      backgroundColor: darkMode ? "#2a2a2a" : "#fff",
                      color: darkMode ? "#eee" : "#000",
                    }}
                  />
                  <button
                    onClick={() => saveEdit(sheet.id)}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 22,
                      fontSize: 16,
                      cursor: "pointer",
                      backgroundColor: darkMode ? "#bb86fc" : "var(--color-primary)",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      userSelect: "none",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = darkMode ? "#d3bafe" : "var(--color-primary-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = darkMode ? "#bb86fc" : "var(--color-primary)")
                    }
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 22,
                      fontSize: 16,
                      cursor: "pointer",
                      backgroundColor: "#e04848",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      userSelect: "none",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: 18,
                      marginBottom: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 10,
                      direction: "ltr",
                      color: darkMode ? "#ddd" : "inherit",
                    }}
                  >
                    <span>
                      Answer Sheet: {sheet.numQuestions} Questions, {sheet.numOptions} Options
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => startEdit(sheet)}
                        style={{
                          padding: "7px 18px",
                          borderRadius: 20,
                          cursor: "pointer",
                          backgroundColor: darkMode ? "#bb86fc" : "var(--color-primary)",
                          color: "#fff",
                          fontWeight: "600",
                          border: "none",
                          userSelect: "none",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = darkMode ? "#d3bafe" : "var(--color-primary-light)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = darkMode ? "#bb86fc" : "var(--color-primary)")
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sheet.id)}
                        style={{
                          padding: "7px 18px",
                          borderRadius: 20,
                          cursor: "pointer",
                          backgroundColor: "#e04848",
                          color: "#fff",
                          fontWeight: "600",
                          border: "none",
                          userSelect: "none",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === sheet.id ? null : sheet.id)
                        }
                        style={{
                          padding: "7px 18px",
                          borderRadius: 20,
                          cursor: "pointer",
                          backgroundColor: darkMode ? "#555" : "#888",
                          color: "#fff",
                          fontWeight: "600",
                          border: "none",
                          userSelect: "none",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = darkMode ? "#777" : "#aaa")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = darkMode ? "#555" : "#888")
                        }
                      >
                        {expandedId === sheet.id ? "Close Questions" : "Enter Questions"}
                      </button>
                    </div>
                  </div>

                  {/* بخش باز شونده سوالات */}
                  <div
                    style={{
                      maxHeight: expandedId === sheet.id ? 600 : 0,
                      opacity: expandedId === sheet.id ? 1 : 0,
                      overflowY: "auto",
                      marginTop: expandedId === sheet.id ? 10 : 0,
                      padding: expandedId === sheet.id ? 15 : 0,
                      borderRadius: 12,
                      backgroundColor: darkMode ? "#333" : "#f9f9f9",
                      transition: "all 0.5s ease",
                      direction: "ltr",
                      pointerEvents: expandedId === sheet.id ? "auto" : "none",
                    }}
                  >
                    {expandedId === sheet.id &&
                      sheet.questions.map((options, qIdx) => (
                        <div
                          key={qIdx}
                          style={{
                            marginBottom: 22,
                            paddingBottom: 8,
                            borderBottom: "1px solid #ddd",
                            userSelect: "none",
                            color: darkMode ? "#ddd" : "#000",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "700",
                              marginBottom: 10,
                              fontSize: 16,
                            }}
                          >
                            Question {qIdx + 1}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            {options.map((_, oIdx) => {
                              const isSelected =
                                userAnswers[sheet.id]?.[qIdx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() =>
                                    handleSelectAnswer(sheet.id, qIdx, oIdx)
                                  }
                                  style={{
                                    padding: "10px 18px",
                                    borderRadius: 26,
                                    cursor: "pointer",
                                    border: isSelected
                                      ? `2.5px solid ${
                                          darkMode ? "#bb86fc" : "var(--color-primary)"
                                        }`
                                      : "1.5px solid #bbb",
                                    backgroundColor: isSelected
                                      ? darkMode
                                        ? "#5a3bcf"
                                        : "#d0e8ff"
                                      : "#fff",
                                    fontWeight: "600",
                                    userSelect: "none",
                                    minWidth: 80,
                                    color: isSelected ? "#fff" : "#000",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  Option {oIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
