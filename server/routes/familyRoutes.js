const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  linkElderByUsername,
  getCareNotes,
  createCareNote,
  deleteCareNote,
  getDocuments,
  uploadDocument,
  deleteDocument,
  getActivityLog,
  sendMessage,
  getMessages,
  getElderDetails,
  createFamilyEvent,
} = require("../controllers/familyController");

// Link elder by username
router.post("/link-elder", protect, linkElderByUsername);

// Care notes
router.get("/care-notes/:elderId", protect, getCareNotes);
router.post("/care-notes", protect, createCareNote);
router.delete("/care-notes/:noteId", protect, deleteCareNote);

// Documents
router.get("/documents/:elderId", protect, getDocuments);
router.post("/documents/upload", protect, uploadDocument);
router.delete("/documents/:docId", protect, deleteDocument);

// Activity log
router.get("/activity-log/:elderId", protect, getActivityLog);

// Messages
router.post("/messages", protect, sendMessage);
router.get("/messages/:elderId", protect, getMessages);

// Create events for linked elders
router.post(
  "/events",
  protect,
  authorize("elder", "family"),
  createFamilyEvent,
);

// Elder details
router.get("/elder-details/:elderId", protect, getElderDetails);

module.exports = router;
