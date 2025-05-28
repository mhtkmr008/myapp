import React, { useState, useEffect } from "react";
import { submitScore } from "../service/service";  // keep your existing submitScore function
import "../css/TestPage.css";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/16ZzlvCasnKrPxj3Myq1q2e-hE44FmFkpbLeySmP0Xoo/export?format=csv&gid=133167483";

    fetch(csvUrl)
      .then(res => res.text())
      .then(csvText => {
        const parsed = parseCSV(csvText);
        setQuestions(parsed);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setErrorMessage("Failed to load questions. Please try again later.");
      });
  }, []);

  const parseCSV = (csv) => {
    const lines = csv.trim().split("\n").filter(line => line.trim() !== "");
    if (lines.length < 2) return [];

    //const headers = lines[0].split(",").map(h => h.trim());
    // Expected headers: question, option1, option2, option3, ..., correctAnswer

    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      const questionText = values[0];
      // Options are all columns except first and last
      const options = values.slice(1, values.length - 1);
      const correctAnswer = values[values.length - 1];
      return { question: questionText, options, correctAnswer };
    });
  };

  const handleOptionChange = (option) => {
    // Select/deselect option on click
    if (answers[currentQuestion] === option) {
      // Deselect if already selected
      const newAnswers = { ...answers };
      delete newAnswers[currentQuestion];
      setAnswers(newAnswers);
    } else {
      setAnswers({ ...answers, [currentQuestion]: option });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = async () => {
    if (!rollNumber.trim() || !name.trim() || !email.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    let tempScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) tempScore++;
    });

    setScore(tempScore);
    setSubmitted(true);
    setLoading(true);
    setErrorMessage("");

    try {
      await submitScore(rollNumber, name, email, tempScore);
      alert("Score submitted successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="test-container">
      <h2>Online Test</h2>

      {!submitted ? (
        <>
          {/* User Info */}
          <div className="user-info">
            <label>
              Name:
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>

            <label>
              Email:
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>

            <label>
              Roll Number:
              <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
            </label>
          </div>

          <hr />

          {/* Main Test Area */}
          <div className="test-layout">
            {/* Question Area */}
            <div className="question-area">
              <p>
                <strong>Q{currentQuestion + 1}:</strong> {questions[currentQuestion].question}
              </p>
              {questions[currentQuestion].options.map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleOptionChange(option)}
                  />
                  {option}
                </label>
              ))}

              <div className="button-group">
                <button onClick={handleNext} disabled={loading}>
                  {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
                </button>
                <button onClick={handleSkip} disabled={loading}>Skip</button>
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            {/* Review Panel */}
            <div className="review-panel">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`review-button ${
                    currentQuestion === index ? "active" : ""
                  } ${answers[index] ? "answered" : "unanswered"}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="result-summary">
          <h3>Test Submitted!</h3>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Roll Number: {rollNumber}</p>
          <p>Your Score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
