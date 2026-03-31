const express = require("express");
const router = express.Router();
const {
  getAllCompanions,
  getCompanionById
} = require("../controllers/companionController");
const authMiddleware = require("../middleware/authMiddleware");

// console.log("getAllCompanions:", getAllCompanions);
// console.log("getCompanionById:", getCompanionById);
// console.log("authMiddleware:", authMiddleware);


router.get("/", authMiddleware.protect, getAllCompanions);
router.get("/:id", authMiddleware.protect, getCompanionById);
module.exports = router;