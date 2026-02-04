const mongoose = require("mongoose");

const yogaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String
    },
    benefits: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga", yogaSchema);
