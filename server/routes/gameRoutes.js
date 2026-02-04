const express = require("express");
const {
  addGameScore,
  getGameHistory
} = require("../controllers/gameController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Elder submits game score
router.post("/add", protect, authorize("elder"), addGameScore);

// Elder & Family view game history
router.get("/list", protect, authorize("elder", "family"), getGameHistory);

module.exports = router;
