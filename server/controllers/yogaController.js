const Yoga = require("../models/yoga");
const YogaSession = require("../models/yogaSession");

exports.addYoga = async (req, res) => {
  try {
    const { title, description, duration, benefits } = req.body;

    const yoga = await Yoga.create({
      title,
      description,
      duration,
      benefits,
    });

    res.status(201).json({
      message: "Yoga exercise added successfully",
      yoga,
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

exports.logYogaSession = async (req, res) => {
  try {
    const session = new YogaSession({
      ...req.body,
      user: req.user.id, // From auth middleware
    });
    await session.save();
    res.status(201).json({ session, message: "Session logged successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyYogaSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { elderId } = req.query;

    let query = {};
    if (elderId) {
      query.user = elderId;
    } else {
      // For family members, get yoga sessions for all their linked elders
      const User = require("../models/user");
      const user = await User.findById(userId);
      if (user.role === "family" && user.elderIds && user.elderIds.length > 0) {
        query.user = { $in: user.elderIds };
      } else {
        query.user = userId;
      }
    }

    const sessions = await YogaSession.find(query)
      .populate("exerciseId", "title")
      .sort({ date: -1 })
      .limit(50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
