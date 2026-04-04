import React, { useEffect, useState } from "react";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function NumberOrderGame({ onFinish }) {
  const [numbers, setNumbers] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const shuffled = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setNumbers(shuffled);
    setNextNumber(1);
    setMessage("");
  };

  const handleClick = (num) => {
    if (num === nextNumber) {
      if (num === 9) {
        setMessage("Great job!");
        onFinish(900);
      } else {
        setNextNumber((prev) => prev + 1);
      }
    } else {
      setMessage("Wrong number. Try again.");
    }
  };

  return (
    <div>
      <h4 className="mb-3">Number Order</h4>
      <p className="text-muted">Tap numbers in order: {nextNumber} to 9</p>
      {message && <div className="alert alert-info py-2">{message}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 90px)",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {numbers.map((num) => (
          <button
            key={num}
            className="btn btn-success"
            style={{ width: "90px", height: "90px", fontSize: "24px" }}
            onClick={() => handleClick(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <button className="btn btn-outline-success" onClick={startGame}>
        Restart
      </button>
    </div>
  );
}

export default NumberOrderGame;
