const express = require("express");
const { chatbotResponse } = require("../controllers/chatbotController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Chatbot interaction
router.post("/message", protect, chatbotResponse);

module.exports = router;
