
const express = require("express");
const router = express.Router();

const {
  createMedicine,
  getMedicines,
  getMedicineHistory,
  updateMedicine,
  takeMedicineSlot,
  skipMedicineSlot,
  refillMedicineStock,
  deleteMedicine,
  getUpcomingReminders,
  autoMarkMissedDoses,
} = require("../controllers/medicineController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createMedicine);
router.get("/list", getMedicines);
router.get("/reminders/upcoming", getUpcomingReminders);
router.get("/:id/history", getMedicineHistory);

router.patch("/:id", updateMedicine);
router.patch("/:id/take", takeMedicineSlot);
router.patch("/:id/skip", skipMedicineSlot);
router.patch("/:id/refill", refillMedicineStock);
router.patch("/mark-missed/today", autoMarkMissedDoses);

router.delete("/:id", deleteMedicine);

module.exports = router;