const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const {
      name,
      email,
      password,
      role,
      username,
      elderUsername,
      elderUsernames,
      specialty,
      experience,
      certifications,
      licenseNumber,
    } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate elder username for elder role
    if (role === "elder") {
      if (!username) {
        return res
          .status(400)
          .json({ message: "Username is required for elder registration" });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // For family role allow linking multiple elders (elderUsernames array) or single elderUsername
    let elderIds = [];
    if (role === "family") {
      const usernames = [];
      if (Array.isArray(elderUsernames)) usernames.push(...elderUsernames);
      if (elderUsername) usernames.push(elderUsername);

      if (usernames.length === 0) {
        return res.status(400).json({
          message:
            "At least one elder username is required for family registration",
        });
      }

      for (const u of usernames) {
        const mapped = await User.findOne({ username: u, role: "elder" });
        if (!mapped) {
          return res
            .status(400)
            .json({ message: `Invalid elder username: ${u}` });
        }
        elderIds.push(mapped._id);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Providers (doctor/companion/nurse) must be approved by admin before activation
    const providerRoles = ["doctor", "companion", "nurse"];
    const isProvider = providerRoles.includes(role);

    const userPayload = {
      name,
      email,
      password: hashedPassword,
      role: role || "elder",
      elderIds: role === "family" ? elderIds : [],
      isActive: isProvider ? false : true,
    };

    // only add username property when registering an elder; leave it undefined otherwise
    if (role === "elder") {
      userPayload.username = username;
    }

    // Attach provider metadata when applicable
    if (isProvider) {
      if (specialty) userPayload.specialty = specialty;
      if (experience) userPayload.experience = experience;
      if (certifications) userPayload.certifications = certifications;
      if (licenseNumber) userPayload.licenseNumber = licenseNumber;
    }

    const user = await User.create(userPayload);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If account is not active (pending admin approval)
    if (user.isActive === false) {
      return res
        .status(403)
        .json({ message: "Account is pending activation by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Return current user info (protected route)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({
      path: "elderIds",
      select: "name username role _id",
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
