import React from "react";
import { useNavigate } from "react-router-dom";

function GameDetail({ game }) {
  const navigate = useNavigate();

  if (!game) {
    return <div className="alert alert-danger">Game not found.</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className={`game-icon-lg bg-${game.color || "primary"} text-white`}>
            {game.icon}
          </div>
          <div>
            <h2 className="mb-1">{game.gameName}</h2>
            <p className="text-muted mb-0">{game.description}</p>
          </div>
        </div>

        <div className="mb-3">
          <span className={`badge bg-${game.color || "primary"} me-2`}>
            {game.category}
          </span>
          <span className="badge bg-secondary me-2">{game.difficulty}</span>
          <span className="badge bg-dark">Best Score: {game.bestScore}</span>
        </div>

        <h5>Instructions</h5>
        <ul className="list-group mb-4">
          {game.instructions?.map((item, index) => (
            <li key={index} className="list-group-item">
              {item}
            </li>
          ))}
        </ul>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/games/${game._id}/play`, { state: { game } })}
          >
            Play Now
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => navigate(`/games/${game._id}/scores`, { state: { game } })}
          >
            View Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;