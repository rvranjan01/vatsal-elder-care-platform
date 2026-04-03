import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import GameDetail from "../../components/games/GameDetail";
import gamesData from "../../components/games/gamesData";

function GameDetailPage() {
  const { gameId } = useParams();
  const location = useLocation();

  const gameFromState = location.state?.game;
  const game = gameFromState || gamesData.find((g) => g._id === gameId);

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/games" className="btn btn-outline-secondary">
          Back to Games
        </Link>
      </div>

      <GameDetail game={game} />
    </div>
  );
}

export default GameDetailPage;