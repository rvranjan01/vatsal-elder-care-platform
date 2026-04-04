

const express = require("express");
const {
  getChatHistory,
  sendMessage,
} = require("../controllers/chatController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get elder's own chat history
router.get(
  "/history",
  protect,
  authorize("elder", "family"),
  getChatHistory,
);

// Send a message to AI and save both sides
router.post(
  "/message",
  protect,
  authorize("elder", "family"),
  sendMessage,
);

module.exports = router;