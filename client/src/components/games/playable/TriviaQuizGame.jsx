
import React, { useEffect, useState } from "react";
import API from "../../../services/api";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function TriviaQuizGame({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await API.get("/games/trivia-questions");
      setQuestions(res.data || []);
    } catch (error) {
      console.error("Error loading trivia questions:", error);
      setErrorMessage("Could not load trivia questions.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selected) => {
    const currentQuestion = questions[current];
    const correct = currentQuestion.correct_answer;

    let updatedScore = score;

    if (selected === correct) {
      updatedScore += 200;
      setScore(updatedScore);
    }

    if (current === questions.length - 1) {
      onFinish(updatedScore);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  if (loading) {
    return <p>Loading trivia questions...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <div className="alert alert-warning">{errorMessage}</div>
        <button className="btn btn-outline-primary" onClick={fetchQuestions}>
          Retry
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div>
        <p>No trivia questions available.</p>
        <button className="btn btn-outline-primary" onClick={fetchQuestions}>
          Retry
        </button>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const answers = shuffleArray([
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ]);

  return (
    <div>
      <h4 className="mb-3">Trivia Quiz</h4>
      <p className="text-muted">
        Question {current + 1} of {questions.length}
      </p>

      <div className="card p-3 mb-3">
        <h5>{decodeHtml(currentQuestion.question)}</h5>
      </div>

      <div className="d-grid gap-2">
        {answers.map((answer, index) => (
          <button
            key={index}
            className="btn btn-outline-primary"
            onClick={() => handleAnswer(answer)}
          >
            {decodeHtml(answer)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TriviaQuizGame;