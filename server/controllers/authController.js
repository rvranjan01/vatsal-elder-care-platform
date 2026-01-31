const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    // 🔍 DEBUG (remove later)
    console.log("Incoming body:", req.body);

    // ✅ SAFE destructuring (prevents crash)
    const { name, email, password, role } = req.body || {};

    // ✅ VALIDATION FIRST
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
