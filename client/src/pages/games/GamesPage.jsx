// import React from "react";
// import { Link } from "react-router-dom";
// import GameList from "../../components/games/GameList";
// import gamesData from "../../components/games/gamesData";

// function GamesPage() {
//   return (
//     <div className="container py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//         <div>
//           <h2 className="mb-1">All Mind Games</h2>
//           <p className="text-muted mb-0">
//             Choose a game and keep your mind active.
//           </p>
//         </div>
//         <Link to="/elder-dashboard" className="btn btn-outline-secondary">
//           Back to Dashboard
//         </Link>
//       </div>

//       <GameList games={gamesData} />
//     </div>
//   );
// }

// export default GamesPage;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import GameList from "../../components/games/GameList";

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamesWithScores();
  }, []);

  const fetchGamesWithScores = async () => {
    try {
      setLoading(true);

      const [gamesRes, scoresRes] = await Promise.all([
        API.get("/games/games-list"),
        API.get("/games/best-scores")
      ]);

      const gamesData = gamesRes.data || [];
      const bestScoresData = scoresRes.data || [];

      const bestScoreMap = {};
      bestScoresData.forEach((item) => {
        bestScoreMap[item._id] = item.bestScore;
      });

      const mergedGames = gamesData.map((game) => ({
        ...game,
        bestScore: bestScoreMap[game._id] || 0
      }));

      setGames(mergedGames);
    } catch (error) {
      console.error("Error fetching games or scores:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <p>Loading games...</p>
      ) : (
        <GameList games={games} />
      )}
    </div>
  );
}

export default GamesPage;