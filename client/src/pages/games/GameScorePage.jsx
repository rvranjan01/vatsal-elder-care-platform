
// import React, { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import API from "../../services/api";
// // import gamesData from "../../components/games/gamesData";

// function GameScorePage() {
//   const { gameId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const gameFromState = location.state?.game;
//   const game = gameFromState || gamesData.find((g) => g._id === gameId) || null;

//   const [gameScores, setGameScores] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchScores();
//   }, [gameId]);

//   const fetchScores = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get(`/games/list/${gameId}`);
//       setGameScores(res.data || []);
//     } catch (error) {
//       console.error("Error fetching scores:", error);
//       setGameScores([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//         <div>
//           <h2>{game?.gameName || "Game"} Scores</h2>
//           <p className="text-muted mb-0">Your saved scores for this game.</p>
//         </div>
//         <button className="btn btn-outline-secondary" onClick={() => navigate("/games")}>
//           Back to Games
//         </button>
//       </div>

//       <div className="card score-card shadow-sm border-0">
//         <div className="card-body">
//           {loading ? (
//             <p>Loading scores...</p>
//           ) : gameScores.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table align-middle">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Game</th>
//                     <th>Score</th>
//                     <th>Played At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {gameScores.map((item, index) => (
//                     <tr key={item._id}>
//                       <td>{index + 1}</td>
//                       <td>{item.gameName}</td>
//                       <td>{item.score}</td>
//                       <td>{new Date(item.playedAt).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="alert alert-light border mb-0">
//               You have not played this game yet.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GameScorePage;


import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function GameScorePage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [game, setGame] = useState(location.state?.game || null);
  const [gameScores, setGameScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();

    if (!game) {
      fetchGame();
    }
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const res = await API.get(`/games/${gameId}`);
      setGame(res.data);
    } catch (error) {
      console.error("Error fetching game:", error);
      setGame(null);
    }
  };

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/games/list/${gameId}`);
      setGameScores(res.data || []);
    } catch (error) {
      console.error("Error fetching scores:", error);
      setGameScores([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2>{game?.gameName || "Game"} Scores</h2>
          <p className="text-muted mb-0">Your saved scores for this game.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/games")}>
          Back to Games
        </button>
      </div>

      <div className="card score-card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <p>Loading scores...</p>
          ) : gameScores.length > 0 ? (
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
                    <tr key={item._id}>
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