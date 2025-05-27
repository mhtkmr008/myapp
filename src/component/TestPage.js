import React, { useState } from "react";
import questionsData from "../data/questions.json";
import { submitScore } from "../service/service"; // Import the service function

const TestPage = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOptionChange = (questionIndex, selectedOption) => {
        if (!rollNumber) return;
        setAnswers({ ...answers, [questionIndex]: selectedOption });
    };

    const handleSubmit = async () => {
        if (!rollNumber.trim()) {
            alert("Please enter a valid roll number!");
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
        setLoading(true);
        setErrorMessage("");

        try {
            const result = await submitScore(rollNumber, tempScore);
            alert(`Score submitted successfully! Response: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
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

                    <button onClick={handleSubmit} disabled={!rollNumber || loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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