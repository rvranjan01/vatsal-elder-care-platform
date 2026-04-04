const YogaExercise = require("../models/yogaExercise");

exports.getYogaExercises = async (req, res) => {
  try {
    const exercises = await YogaExercise.find({}).sort({ createdAt: -1 });
    res.status(200).json({ exercises });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createYogaExercise = async (req, res) => {
  try {
    const exercise = new YogaExercise({
      ...req.body,
      benefits: req.body.benefits
        ? req.body.benefits.split(",").map((b) => b.trim())
        : [],
      instructions: req.body.instructions
        ? req.body.instructions.split(",").map((i) => i.trim())
        : [],
    });
    await exercise.save();
    res.status(201).json({ exercise });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateYogaExercise = async (req, res) => {
  try {
    const exercise = await YogaExercise.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        benefits: req.body.benefits
          ? req.body.benefits.split(",").map((b) => b.trim())
          : [],
        instructions: req.body.instructions
          ? req.body.instructions.split(",").map((i) => i.trim())
          : [],
      },
      { new: true },
    );
    res.json({ exercise });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteYogaExercise = async (req, res) => {
  try {
    await YogaExercise.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
