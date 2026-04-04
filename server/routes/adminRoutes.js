const express = require("express");
const {
  getPendingProviders,
  getActiveProviders,
  activateProvider,
  deactivateProvider,
  getSignupsByRole,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only routes
router.get(
  "/pending-providers",
  protect,
  authorize("admin"),
  getPendingProviders,
);
router.get(
  "/active-providers",
  protect,
  authorize("admin"),
  getActiveProviders,
);
router.put(
  "/activate/:providerId",
  protect,
  authorize("admin"),
  activateProvider,
);
router.put(
  "/deactivate/:providerId",
  protect,
  authorize("admin"),
  deactivateProvider,
);
router.get("/signups", protect, authorize("admin"), getSignupsByRole);

// Public route: browse active providers (for families/elders)
router.get(
  "/providers/browse",
  protect,
  authorize("elder", "family"),
  getActiveProviders,
);

module.exports = router;
