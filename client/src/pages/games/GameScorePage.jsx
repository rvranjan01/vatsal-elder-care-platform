import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import gamesData from "../../components/games/gamesData";

function GameScorePage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const gameFromState = location.state?.game;
  const game = gameFromState || gamesData.find((g) => g._id === gameId);

  const allScores = JSON.parse(localStorage.getItem("gameScores")) || [];
  const gameScores = allScores
    .filter((item) => item.gameId === gameId)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2>{game?.gameName || "Game"} Scores</h2>
          <p className="text-muted mb-0">Previously saved scores for this game.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/games")}>
          Back to Games
        </button>
      </div>

      <div className="card score-card shadow-sm border-0">
        <div className="card-body">
          {gameScores.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Game</th>
                    <th>Score</th>
                    <th>Played At</th>
                  </tr>
                </thead>
                <tbody>
                  {gameScores.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.gameName}</td>
                      <td>{item.score}</td>
                      <td>{new Date(item.playedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-light border mb-0">
              No scores saved yet for this game.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameScorePage;