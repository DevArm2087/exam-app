import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Exam() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [examTitle, setExamTitle] = useState("");          // Exam title
  const [numQuestions, setNumQuestions] = useState(5);
  const [numOptions, setNumOptions] = useState(4);
  const [duration, setDuration] = useState(300);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (step !== 2) return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, step]);

  const startExam = () => {
    if (!examTitle.trim()) return alert("Please enter the exam title");
    if (numQuestions < 1) return alert("Number of questions must be at least 1");
    if (numOptions < 2) return alert("Number of options must be at least 2");
    setAnswers({});
    setTimeLeft(duration);
    setStep(2);
    setResults(null);
    setCorrectAnswers({});
  };

  const selectAnswer = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const finishExam = () => {
    setStep(3);
    clearTimeout(timerRef.current);
  };

  const enterCorrectAnswer = (qId, optionIndex) => {
    setCorrectAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const showResults = () => {
    let correctCount = 0,
      wrongCount = 0,
      notAnswered = 0;

    for (let i = 1; i <= numQuestions; i++) {
      const userAns = answers[i];
      const correctAns = correctAnswers[i];
      if (userAns === undefined) {
        notAnswered++;
      } else if (userAns === correctAns) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const negativePoints = Math.floor(wrongCount / 3);
    const finalCorrect = Math.max(0, correctCount - negativePoints);
    const percentage = ((finalCorrect / numQuestions) * 100).toFixed(2);

    const resultObj = {
      examTitle,
      numQuestions,
      numOptions,
      results: {
        correctCount,
        wrongCount,
        notAnswered,
        negativePoints,
        finalCorrect,
        percentage,
      },
      answers,
      correctAnswers,
      timestamp: Date.now(),
    };

    const savedResults = JSON.parse(localStorage.getItem("examResultsList") || "[]");
    savedResults.push(resultObj);
    localStorage.setItem("examResultsList", JSON.stringify(savedResults));

    setResults(resultObj.results);
    setStep(4);
  };

  const restart = () => {
    setStep(1);
    setAnswers({});
    setCorrectAnswers({});
    setResults(null);
    setExamTitle("");
  };

  return (
    <div className="fade-in container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Exam Interface</h2>

      {step === 1 && (
        <div className="exam-setup input-group">
          <label>
            🏷️ Exam Title:
            <input
              type="text"
              placeholder="Enter exam title"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="input-text"
            />
          </label>

          <label>
            📝 Number of Questions:
            <input
              type="number"
              min={1}
              max={100}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="input-text"
            />
          </label>

          <label>
            🎯 Number of Options per Question:
            <select
              value={numOptions}
              onChange={(e) => setNumOptions(Number(e.target.value))}
              className="input-select"
            >
              {[2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label>
            ⏱ Duration (seconds):
            <input
              type="number"
              min={10}
              max={3600}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="input-text"
            />
          </label>

          <button className="btn-primary" onClick={startExam} style={{ marginTop: "1rem", flex: "0 0 100%" }}>
            Start Exam
          </button>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="timer" style={{ marginBottom: "1rem" }}>
            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>

          {[...Array(numQuestions)].map((_, i) => {
            const qId = i + 1;
            return (
              <div key={qId} className="question-card">
                <p>
                  <strong>Question {qId}:</strong> Choose one option
                </p>
                <div className="options-container">
                  {[...Array(numOptions)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`answer-option ${answers[qId] === idx ? "selected" : ""}`}
                      onClick={() => selectAnswer(qId, idx)}
                      type="button"
                    >
                      Option {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button className="btn-danger" onClick={finishExam} style={{ marginTop: "1rem" }}>
            Finish Exam
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>Enter Correct Answers</h3>

          {[...Array(numQuestions)].map((_, i) => {
            const qId = i + 1;
            return (
              <div key={qId} className="question-card">
                <p>
                  <strong>Question {qId}:</strong> Select correct option
                </p>
                <div className="options-container">
                  {[...Array(numOptions)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`answer-option ${correctAnswers[qId] === idx ? "selected" : ""}`}
                      onClick={() => enterCorrectAnswer(qId, idx)}
                      type="button"
                    >
                      Option {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            className="btn-primary"
            onClick={() => {
              if (Object.keys(correctAnswers).length !== numQuestions) {
                alert("Please select correct answer for every question.");
                return;
              }
              showResults();
            }}
            style={{ marginTop: "1rem" }}
          >
            Show Results
          </button>
        </>
      )}

      {step === 4 && results && (
        <div className="results-section">
          <h3>Exam Results</h3>
          <p>Total Questions: {numQuestions}</p>
          <p>Correct Answers: {results.correctCount}</p>
          <p>Wrong Answers: {results.wrongCount}</p>
          <p>Not Answered: {results.notAnswered}</p>
          <p>Negative Points (1 for every 3 wrong): {results.negativePoints}</p>
          <p>Final Correct (after deduction): {results.finalCorrect}</p>
          <p>Percentage: {results.percentage} %</p>

          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            {[...Array(numQuestions)].map((_, i) => {
              const qId = i + 1;
              const userChoice = answers[qId];
              const correctChoice = correctAnswers[qId];
              return (
                <div
                  key={qId}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <p>
                    <strong>Question {qId}:</strong>
                  </p>
                  <div className="options-container" style={{ justifyContent: "flex-end" }}>
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

          <button className="btn-primary" onClick={restart} style={{ marginTop: "2rem" }}>
            New Exam
          </button>
        </div>
      )}
    </div>
  );
}
