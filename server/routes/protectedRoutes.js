const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Elder-only route
router.get(
  "/elder",
  protect,
  authorize("elder"),
  (req, res) => {
    res.json({ message: "Welcome Elder User" });
  }
);

// Family-only route
router.get(
  "/family",
  protect,
  authorize("family"),
  (req, res) => {
    res.json({ message: "Welcome Family User" });
  }
);

module.exports = router;
