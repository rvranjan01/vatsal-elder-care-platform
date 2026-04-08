const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

const seedAdmin = async () => {
  try {
    // Connect to DB
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/vatsal";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      return; // Don't exit; just return so server continues
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt); // Change this password!

    const admin = await User.create({
      name: "System Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      username: "admin",
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log("Password: admin123 (please change via profile settings)");
    console.log("Admin ID:", admin._id);

  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

// Allow both: direct execution and module usage
if (require.main === module) {
  seedAdmin().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedAdmin;
