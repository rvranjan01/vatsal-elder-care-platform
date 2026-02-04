const Yoga = require("../models/yoga");

exports.addYoga = async (req, res) => {
  try {
    const { title, description, duration, benefits } = req.body;

    const yoga = await Yoga.create({
      title,
      description,
      duration,
      benefits
    });

    res.status(201).json({
      message: "Yoga exercise added successfully",
      yoga
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getYogaList = async (req, res) => {
  try {
    const yogaList = await Yoga.find().sort({ createdAt: -1 });
    res.status(200).json(yogaList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
