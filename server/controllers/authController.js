const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


exports.registerUser = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { name, email, password, role, username, elderUsername } = req.body || {};

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let mappedElder = null;

    // 🔥 If role is elder → require unique username
    if (role === "elder") {
      if (!username) {
        return res.status(400).json({
          message: "Username is required for elder registration",
        });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }
    }

    // 🔥 If role is family → require elderUsername
    if (role === "family") {
      if (!elderUsername) {
        return res.status(400).json({
          message: "Elder username is required",
        });
      }

      mappedElder = await User.findOne({
        username: elderUsername,
        role: "elder",
      });

      if (!mappedElder) {
        return res.status(400).json({
          message: "Invalid elder username",
        });
      }
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "elder",
      username: role === "elder" ? username : null,
      elderId: role === "family" ? mappedElder._id : null,
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


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

