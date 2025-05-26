import React, { useState } from "react";
import questionsData from "../data/questions.json";

const TestPage = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionIndex, selectedOption) => {
    if (!rollNumber) return; // Prevent answering before roll number is entered
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = async () => {
    if (!rollNumber) {
      alert("Please enter your roll number before submitting!");
      return;
    }
  
    let tempScore = 0;
    questionsData.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        tempScore++;
      }
    });
  
    setScore(tempScore);
    setSubmitted(true);
  
    const dataToSend = {
      rollNumber: rollNumber,
      score: tempScore,
    };
  
    alert("Sending to script:\n" + JSON.stringify(dataToSend, null, 2));
  
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyeh0VMNUAcjqUdWUdBcxP-6zif9kFcK3FGJsTl0oHLyDVCW7T9NNgmeSk5YB1TNdVX/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
  
      const result = await response.json();
      console.log("Response from Google Apps Script:", result);
      alert(`Score submitted successfully! View the response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Submission failed, please try again.");
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
                    disabled={!rollNumber}
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
          <p>
            Your Score: {score} / {questionsData.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
