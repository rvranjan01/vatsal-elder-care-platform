const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getYogaExercises,
  createYogaExercise,
  updateYogaExercise,
  deleteYogaExercise,
} = require("../controllers/yogaAdminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/yoga-exercises", getYogaExercises);
router.post("/yoga-exercises", createYogaExercise);
router.put("/yoga-exercises/:id", updateYogaExercise);
router.delete("/yoga-exercises/:id", deleteYogaExercise);

module.exports = router;
