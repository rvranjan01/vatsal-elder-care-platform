const express = require("express");
const {
  addGameScore,
  getGameHistory,
  getGamesList,
  getGameById,
  getGameScoresByGameId,
  getMyBestScores,
  getTriviaQuestions,
} = require("../controllers/gameController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all game cards for elder
router.get("/games-list", protect, authorize("elder"), getGamesList);

// Get single game details
router.get("/games-list/:gameId", protect, authorize("elder"), getGameById);

// Elder submits game score
router.post("/add", protect, authorize("elder"), addGameScore);

// Elder views own full game history
router.get("/list", protect, authorize("elder"), getGameHistory);

// Elder views own scores for one specific game
router.get("/list/:gameId", protect, authorize("elder"), getGameScoresByGameId);

// Elder views best scores summary
router.get("/best-scores", protect, authorize("elder"), getMyBestScores);

router.get(
  "/trivia-questions",
  protect,
  authorize("elder"),
  getTriviaQuestions,
);

module.exports = router;
