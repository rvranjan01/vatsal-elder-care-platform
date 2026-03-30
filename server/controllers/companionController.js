const User = require("../models/user");

exports.getAllCompanions = async (req, res) => {
  try {
    const companions = await User.find({ role: "companion" }).select("-password");

    res.status(200).json({
      success: true,
      companions
    });
  } catch (error) {
    console.error("Error fetching companions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCompanionById = async (req, res) => {
  try {
    const companion = await User.findOne({
      _id: req.params.id,
      role: "companion"
    }).select("-password");

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: "Companion not found"
      });
    }

    res.status(200).json({
      success: true,
      companion
    });
  } catch (error) {
    console.error("Error fetching companion profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// module.exports = {
//   getAllCompanions,
//   getCompanionById
// };