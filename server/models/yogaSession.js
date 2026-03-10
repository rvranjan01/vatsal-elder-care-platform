// models/YogaSession.js - NEW FILE
const mongoose = require('mongoose');

const yogaSessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  exerciseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'YogaExercise' 
  },
  exerciseTitle: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: String, 
    required: true 
  },
  notes: String,
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('yogaSession', yogaSessionSchema);
