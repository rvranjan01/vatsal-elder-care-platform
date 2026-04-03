import React from "react";
import { useNavigate } from "react-router-dom";
import "./games.css";

function GameCard({ game, showViewButton = true }) {
  const navigate = useNavigate();

  return (
    <div className="card game-card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className={`game-icon bg-${game.color || "primary"} text-white`}>
            {game.icon}
          </div>
          <span className="badge bg-light text-dark">{game.category}</span>
        </div>

        <h5 className="card-title mb-2">{game.gameName}</h5>
        <p className="card-text text-muted small">{game.description}</p>

        <div className="mb-3">
          <span className={`badge bg-${game.color || "primary"} me-2`}>
            {game.difficulty}
          </span>
          <span className="badge bg-secondary">
            Best: {game.bestScore || 0}
          </span>
        </div>

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/games/${game._id}/play`, { state: { game } })}
          >
            Play
          </button>

          {showViewButton && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(`/games/${game._id}`, { state: { game } })}
            >
              View Details
            </button>
          )}

          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => navigate(`/games/${game._id}/scores`, { state: { game } })}
          >
            Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;