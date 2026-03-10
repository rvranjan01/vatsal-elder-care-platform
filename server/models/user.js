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
    enum: ["elder", "family", "doctor", "companion", "nurse", "admin"],
    required: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    required: function() {
      return this.role === 'elder';
    }
  },
  // For families: link to one or more elder accounts
  elderIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  // Provider metadata
  specialty: {
    type: String,
    trim: true,
    default: null
  },
  experience: {
    type: String,
    trim: true,
    default: null
  },
  certifications: {
    type: String,
    trim: true,
    default: null
  },
  licenseNumber: {
    type: String,
    trim: true,
    default: null
  },
  // Account activation (providers need admin approval)
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// make sure the unique index only applies to documents where username is a string
// userSchema.index({ username: 1 }, { unique: true, partialFilterExpression: { username: { $type: 'string' } } });

module.exports = mongoose.model("User", userSchema);
