const express = require("express");
const { addYoga, getYogaList } = require("../controllers/yogaController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Add yoga (admin use / testing)
router.post("/add", protect, authorize("elder"), addYoga);

// View yoga list
router.get("/list", protect, getYogaList);

module.exports = router;
