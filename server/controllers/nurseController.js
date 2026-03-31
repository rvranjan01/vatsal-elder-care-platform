const User = require("../models/user");

exports.getAllNurses = async (req, res) => {
  try {
    const nurses = await User.find({ role: "nurse", isActive: true }).select("-password");

    res.status(200).json({
      success: true,
      nurses
    });
  } catch (error) {
    console.error("Error fetching nurses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNurseById = async (req, res) => {
  try {
    const nurse = await User.findOne({
      _id: req.params.id,
      role: "nurse",
      isActive: true
    }).select("-password");

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found"
      });
    }

    res.status(200).json({
      success: true,
      nurse
    });
  } catch (error) {
    console.error("Error fetching nurse profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};