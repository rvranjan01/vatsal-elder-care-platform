// const mongoose = require("mongoose");

// const gameScoreSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     gameId: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     gameName: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     score: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     playedAt: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("GameScore", gameScoreSchema);\


const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gameId: {
      type: String,
      required: true,
      trim: true
    },
    gameName: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameScore", gameScoreSchema);