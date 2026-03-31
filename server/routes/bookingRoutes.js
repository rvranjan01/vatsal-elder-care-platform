const express = require("express");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getPendingBookingsForProvider,
  confirmBooking,
  rejectBooking,
  bookCompanion,
  bookNurse
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Both elder and family can create bookings
router.post("/create", protect, authorize("elder", "family"), createBooking);

// Specific route for booking a companion
// router.post("/book-companion", authMiddleware.protect, bookCompanion);
router.post("/book-companion", protect, authorize("elder", "family"), bookCompanion);

router.post("/book-nurse", protect, authorize("elder", "family"), bookNurse);

// Get user's own bookings
router.get("/my-bookings", protect, authorize("elder", "family"), getMyBookings);

// Get all bookings (for admin/viewing)
router.get("/all", protect, getAllBookings);

// Get pending bookings for provider (provider only)
router.get("/pending", protect, authorize("doctor", "companion", "nurse"), getPendingBookingsForProvider);

// Provider confirms a booking
router.put("/:bookingId/confirm", protect, authorize("doctor", "companion", "nurse"), confirmBooking);

// Provider rejects a booking
router.put("/:bookingId/reject", protect, authorize("doctor", "companion", "nurse"), rejectBooking);

// Get single booking
router.get("/:id", protect, getBookingById);

// Update booking
router.put("/:id", protect, authorize("elder", "family"), updateBooking);

// Cancel booking
router.delete("/cancel/:id", protect, authorize("elder", "family"), cancelBooking);

// Delete booking
router.delete("/:id", protect, authorize("elder", "family"), deleteBooking);

module.exports = router;
