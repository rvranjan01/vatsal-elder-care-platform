import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import MemoryMatchGame from "../../components/games/playable/MemoryMatchGame";
import NumberOrderGame from "../../components/games/playable/NumberOrderGame";
import TriviaQuizGame from "../../components/games/playable/TriviaQuizGame";

function GamePlayPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [game, setGame] = useState(location.state?.game || null);
  const [message, setMessage] = useState("");
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
      console.error("Error fetching game:", error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishGame = async (finalScore) => {
    try {
      await API.post("/games/add", {
        gameId: game._id,
        gameName: game.gameName,
        score: finalScore,
      });

      setMessage(`Game finished. Score saved: ${finalScore}`);

      setTimeout(() => {
        navigate(`/games/${game._id}/scores`, { state: { game } });
      }, 1200);
    } catch (error) {
      console.error("Error saving game score:", error);
      setMessage("Failed to save score.");
    }
  };

  const renderGameComponent = () => {
    switch (game?._id) {
      case "memory-match":
        return <MemoryMatchGame onFinish={handleFinishGame} />;
      case "number-order":
        return <NumberOrderGame onFinish={handleFinishGame} />;
      case "trivia-quiz":
        return <TriviaQuizGame onFinish={handleFinishGame} />;
      default:
        return (
          <div className="text-center">
            <p>This real game is not added yet.</p>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="container py-4">Loading game...</div>;
  }

  if (!game) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Game not found.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2>{game.gameName}</h2>
        <p className="text-muted">{game.description}</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="p-3 mb-3">{renderGameComponent()}</div>

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
