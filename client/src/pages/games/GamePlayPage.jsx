import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import gamesData from "../../components/games/gamesData";

function GamePlayPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameFromState = location.state?.game;
  const game = gameFromState || gamesData.find((g) => g._id === gameId);

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  if (!game) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Game not found.</div>
      </div>
    );
  }

  const handleIncreaseScore = () => {
    setScore((prev) => prev + 10);
  };

  const handleFinishGame = () => {
    const gameScores = JSON.parse(localStorage.getItem("gameScores")) || [];

    const newScore = {
      id: Date.now(),
      gameId: game._id,
      gameName: game.gameName,
      score,
      playedAt: new Date().toISOString()
    };

    gameScores.push(newScore);
    localStorage.setItem("gameScores", JSON.stringify(gameScores));
    setMessage("Score saved successfully.");

    setTimeout(() => {
      navigate(`/games/${game._id}/scores`, { state: { game } });
    }, 1000);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2>{game.gameName}</h2>
        <p className="text-muted">{game.description}</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="game-play-box d-flex flex-column align-items-center justify-content-center text-center p-4 mb-4">
            <div style={{ fontSize: "64px" }}>{game.icon}</div>
            <h4 className="mt-3">Sample Play Area</h4>
            <p className="text-muted">
              Replace this box with the real game component.
            </p>

            <div className="mt-3">
              <h5>Current Score: {score}</h5>
              <button className="btn btn-success me-2" onClick={handleIncreaseScore}>
                +10 Score
              </button>
              <button className="btn btn-primary" onClick={handleFinishGame}>
                Finish Game
              </button>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/games")}
          >
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePlayPage;