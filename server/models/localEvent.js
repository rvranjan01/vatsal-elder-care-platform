const mongoose = require("mongoose");

const localEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: String,
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: String,
    type: {
      type: String,
      enum: ["health", "social", "creative", "wellness"],
      default: "health",
    },
    organizer: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LocalEvent", localEventSchema);
