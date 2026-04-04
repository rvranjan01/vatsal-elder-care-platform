const express = require("express");
const {
  getPublicLocalEvents,
} = require("../controllers/publicEventsController");

const router = express.Router();

router.get("/local-events", getPublicLocalEvents);

module.exports = router;
