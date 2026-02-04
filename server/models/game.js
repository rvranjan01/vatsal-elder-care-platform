const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gameName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    remarks: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
