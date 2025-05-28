import React, { useState } from "react";
import questionsData from "../data/questions.json";
import { submitScore } from "../service/service";
import "../css/TestPage.css";

const TestPage = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOptionChange = (selectedOption) => {
        setAnswers({ ...answers, [currentQuestion]: selectedOption });
    };

    const handleNext = () => {
        if (currentQuestion < questionsData.length - 1) {
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
        questionsData.forEach((q, index) => {
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

    return (
        <div className="test-container">
            <h2>Online Test</h2>

            {!submitted ? (
                <>
                    {/* User Info */}
                    <div className="user-info">
                        <label>
                            Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>

                        <label>
                            Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>

                        <label>
                            Roll Number:
                            <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                        </label>
                    </div>

                    <hr />

                    {/* Main Test Area */}
                    <div className="test-layout">
                        {/* Question Area */}
                        <div className="question-area">
                            <p>
                                <strong>Q{currentQuestion + 1}:</strong> {questionsData[currentQuestion].question}
                            </p>
                            {questionsData[currentQuestion].options.map((option, index) => (
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
                                    {currentQuestion < questionsData.length - 1 ? "Next" : "Submit"}
                                </button>
                                <button onClick={handleSkip} disabled={loading}>Skip</button>
                            </div>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </div>

                        {/* Review Panel */}
                        <div className="review-panel">
                            {questionsData.map((_, index) => (
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
                    <p>Your Score: {score} / {questionsData.length}</p>
                </div>
            )}
        </div>
    );
};

export default TestPage;
