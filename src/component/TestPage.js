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

  const handleSubmit = () => {
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

    // Show data being sent
    const dataToSend = {
      rollNumber: rollNumber,
      score: tempScore,
    };
    alert("Sending to script:\n" + JSON.stringify(dataToSend, null, 2));

    // Create a form to submit data
    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      "https://script.google.com/macros/s/AKfycbyeh0VMNUAcjqUdWUdBcxP-6zif9kFcK3FGJsTl0oHLyDVCW7T9NNgmeSk5YB1TNdVX/exec";

    const rollInput = document.createElement("input");
    rollInput.type = "hidden";
    rollInput.name = "rollNumber";
    rollInput.value = rollNumber;
    form.appendChild(rollInput);

    const scoreInput = document.createElement("input");
    scoreInput.type = "hidden";
    scoreInput.name = "score";
    scoreInput.value = tempScore;
    form.appendChild(scoreInput);

    document.body.appendChild(form);
    form.submit();
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
