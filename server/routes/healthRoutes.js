const express = require("express");
const { addHealthData, getHealthData } = require("../controllers/healthController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Elder can add health data
router.post("/add", protect, authorize("elder"), addHealthData);


// Elder & Family can view health data
router.get("/list", protect, authorize("elder", "family"), getHealthData);


module.exports = router;
