const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bloodPressure: {
      type: String,
      required: true
    },
    sugarLevel: {
      type: String,
      required: true
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Health", healthSchema);
