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



// Doctor notes routes
router.post("/notes", authMiddleware.protect, createNote);
router.get("/notes", authMiddleware.protect, getMyNotes); // For elder/family to view their notes - MUST be before /notes/:elderId
router.get("/notes/:elderId", authMiddleware.protect, getNotesForElder); // Get notes for specific elder
router.delete("/notes/:noteId", authMiddleware.protect, deleteNote);

// Generic doctor routes AFTER
router.get("/", authMiddleware.protect, getAllDoctors);
router.get("/:id", authMiddleware.protect, getDoctorById);

module.exports = router;
