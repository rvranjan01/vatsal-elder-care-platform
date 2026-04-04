const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getLocalEvents,
  createLocalEvent,
  updateLocalEvent,
  deleteLocalEvent,
} = require("../controllers/localEventsAdminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/local-events", getLocalEvents);
router.post("/local-events", createLocalEvent);
router.put("/local-events/:id", updateLocalEvent);
router.delete("/local-events/:id", deleteLocalEvent);

module.exports = router;
