const express = require("express");
const router = express.Router();
const {
  getAllNurses,
  getNurseById,
} = require("../controllers/nurseController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.protect, getAllNurses);
router.get("/:id", authMiddleware.protect, getNurseById);

module.exports = router;
