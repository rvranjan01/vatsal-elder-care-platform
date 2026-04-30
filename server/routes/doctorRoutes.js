const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
} = require("../controllers/doctorController");
const {
  createNote,
  getNotesForElder,
  getDoctorNotesForPatient,
  getMyNotes,
  deleteNote,
} = require("../controllers/doctorNoteController");
const authMiddleware = require("../middleware/authMiddleware");

// Generic doctor routes AFTER
router.get("/", authMiddleware.protect, getAllDoctors);
router.get("/:id", authMiddleware.protect, getDoctorById);

// Doctor notes routes
router.post("/notes", authMiddleware.protect, createNote);
router.get("/notes/:elderId", authMiddleware.protect, getNotesForElder); // Get notes for specific elder
router.get("/notes", authMiddleware.protect, getMyNotes); // For elder/family to view their notes
router.delete("/notes/:noteId", authMiddleware.protect, deleteNote);

module.exports = router;
