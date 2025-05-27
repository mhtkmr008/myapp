import React, { useState } from "react";
import questionsData from "../data/questions.json";
import { submitScore } from "../service/service";

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
            handleSubmit(); // last question, submit
        }
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
        <div>
            <h2>Online Test</h2>

            {!submitted ? (
                <>
                    <div>
                        <label>Name: </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Roll Number: </label>
                        <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                    </div>
                    <hr />

                    <div>
                        <p>
                            <strong>Q{currentQuestion + 1}:</strong> {questionsData[currentQuestion].question}
                        </p>
                        {questionsData[currentQuestion].options.map((option, index) => (
                            <label key={index} style={{ display: "block" }}>
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
                    </div>

                    <button onClick={handleNext} disabled={!answers[currentQuestion] || loading}>
                        {currentQuestion < questionsData.length - 1 ? "Next" : "Submit"}
                    </button>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </>
            ) : (
                <div>
                    <h3>Test Submitted!</h3>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
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
