import React from "react";
import { Link } from "react-router-dom";
import GameList from "../../components/games/GameList";
import gamesData from "../../components/games/gamesData";

function GamesPage() {
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-1">All Mind Games</h2>
          <p className="text-muted mb-0">
            Choose a game and keep your mind active.
          </p>
        </div>
        <Link to="/elder-dashboard" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>

      <GameList games={gamesData} />
    </div>
  );
}

export default GamesPage;