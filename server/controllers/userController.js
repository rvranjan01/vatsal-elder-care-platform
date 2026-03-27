const User = require("../models/user"); // uppercase

exports.getMyProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};