import React from "react";
import GameCard from "./GameCard";

function GameList({ games, limit, title, emptyMessage = "No games available." }) {
  const displayGames = limit ? games.slice(0, limit) : games;

  return (
    <div className="game-list-wrapper">
      {title && <h3 className="mb-3">{title}</h3>}

      {displayGames.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {displayGames.map((game) => (
            <div className="col" key={game._id}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-light border">{emptyMessage}</div>
      )}
    </div>
  );
}

export default GameList;