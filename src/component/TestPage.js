import React, { useState } from "react";
import questionsData from "../data/questions.json";

const TestPage = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers({
      ...answers,
      [questionIndex]: selectedOption
    });
  };

  const handleSubmit = async () => {
    let tempScore = 0;

    questionsData.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        tempScore++;
      }
    });

    setScore(tempScore);
    setSubmitted(true);

    // Send to Google Sheets
    const response = await fetch("https://script.google.com/macros/s/AKfycbyeh0VMNUAcjqUdWUdBcxP-6zif9kFcK3FGJsTl0oHLyDVCW7T9NNgmeSk5YB1TNdVX/exec", {
      method: "POST",
      body: JSON.stringify({
        rollNumber,
        score: tempScore
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      alert("Score submitted successfully!");
    } else {
      alert("Failed to submit score.");
    }
  };

  return (
    <div>
      <h2>Online Test</h2>

      {!submitted ? (
        <>
          <div>
            <label>Enter Roll Number: </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          {questionsData.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((option, optIdx) => (
                <label key={optIdx}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                  />
                  {option}
                </label>
              ))}
              <hr />
            </div>
          ))}

          <button onClick={handleSubmit} disabled={!rollNumber}>
            Submit
          </button>
        </>
      ) : (
        <div>
          <h3>Test Submitted!</h3>
          <p>Roll Number: {rollNumber}</p>
          <p>Your Score: {score} / {questionsData.length}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
