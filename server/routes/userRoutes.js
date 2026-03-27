const express = require("express");
const router = express.Router();

const { getMyProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);

module.exports = router;