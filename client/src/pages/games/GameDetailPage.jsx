import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import API from "../../services/api";
import GameDetail from "../../components/games/GameDetail";

function GameDetailPage() {
  const { gameId } = useParams();
  const location = useLocation();

  const [game, setGame] = useState(location.state?.game || null);
  const [loading, setLoading] = useState(!location.state?.game);

  useEffect(() => {
    if (!game) {
      fetchGame();
    }
  }, [gameId]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/games/${gameId}`);
      setGame(res.data);
    } catch (error) {
      console.error("Error fetching game details:", error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/games" className="btn btn-outline-secondary">
          Back to Games
        </Link>
      </div>

      {loading ? <p>Loading game details...</p> : <GameDetail game={game} />}
    </div>
  );
}

export default GameDetailPage;
