const express = require("express");
const {
  addHealthData,
  getHealthData,
} = require("../controllers/healthController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Elder, Family, and Doctor can add health data
router.post(
  "/add",
  protect,
  authorize("elder", "family", "doctor"),
  addHealthData,
);

// Elder, Family, and Doctor can view health data
router.get(
  "/list",
  protect,
  authorize("elder", "family", "doctor"),
  getHealthData,
);

module.exports = router;
