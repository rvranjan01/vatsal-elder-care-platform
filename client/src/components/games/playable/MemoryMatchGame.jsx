import React, { useEffect, useState } from "react";

const icons = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍍"];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function MemoryMatchGame({ onFinish }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const duplicated = [...icons, ...icons].map((icon, index) => ({
      id: index,
      icon,
    }));

    setCards(shuffleArray(duplicated));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setDisabled(false);
  };

  const handleCardClick = (index) => {
    if (
      disabled ||
      flipped.includes(index) ||
      matched.includes(cards[index].icon)
    ) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setDisabled(true);

      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.icon === secondCard.icon) {
        setMatched((prev) => [...prev, firstCard.icon]);
        setFlipped([]);
        setDisabled(false);

        if (matched.length + 1 === icons.length) {
          const finalScore = Math.max(1000 - moves * 20, 100);
          setTimeout(() => {
            onFinish(finalScore);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 900);
      }
    }
  };

  return (
    <div>
      <h4 className="mb-3">Memory Match</h4>
      <p className="text-muted">Moves: {moves}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 80px)",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {cards.map((card, index) => {
          const isOpen =
            flipped.includes(index) || matched.includes(card.icon);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                width: "80px",
                height: "80px",
                fontSize: "28px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                backgroundColor: isOpen ? "#fff" : "#0d6efd",
                color: isOpen ? "#000" : "#fff",
              }}
            >
              {isOpen ? card.icon : "?"}
            </button>
          );
        })}
      </div>

      <button className="btn btn-outline-primary" onClick={startGame}>
        Restart
      </button>
    </div>
  );
}

export default MemoryMatchGame;