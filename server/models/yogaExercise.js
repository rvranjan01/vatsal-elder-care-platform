const mongoose = require("mongoose");

const yogaExerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    }, // minutes
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    benefits: [
      {
        type: String,
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    }, // 'breathing', 'stretching', 'strength'
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("YogaExercise", yogaExerciseSchema);
