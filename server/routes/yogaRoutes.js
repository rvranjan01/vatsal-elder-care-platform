const express = require('express');
const { protect } = require('../middleware/authMiddleware'); 
const { logYogaSession, getMyYogaSessions } = require('../controllers/yogaController');

const YogaExercise = require('../models/yogaExercise');
const router = express.Router();
// PUBLIC ROUTE - Elders see admin-created exercises
router.get('/list', async (req, res) => {
  try {
    const exercises = await YogaExercise.find({ isActive: true })
      .select('title description duration benefits category difficulty')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(exercises);  // Matches: Yoga.jsx + ElderDashboard expect array directly
  } catch (error) {
    console.error('Yoga list error:', error);
    res.status(500).json([]);
  }
});

// ✅ NEW: Protected session routes
router.use(protect);  // All session routes need auth

router.post('/log-session', logYogaSession);
router.get('/my-sessions', getMyYogaSessions);

module.exports = router;