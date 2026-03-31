const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.protect, getAllDoctors);
router.get("/:id", authMiddleware.protect, getDoctorById);

module.exports = router;