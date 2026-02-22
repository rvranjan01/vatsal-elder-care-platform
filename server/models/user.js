const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["elder", "family"],
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  elderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
