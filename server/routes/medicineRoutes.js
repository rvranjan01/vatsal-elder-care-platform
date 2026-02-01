const express = require("express");
const { addMedicine, getMedicines } = require("../controllers/medicineController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Add medicine
// router.post("/add", addMedicine);
router.post("/add", protect, authorize("elder"), addMedicine);

// Get medicine list
// router.get("/list", getMedicines);
router.get("/list", protect, authorize("elder", "family"), getMedicines);


module.exports = router;
