const mongoose = require("mongoose");

const doctorNoteSchema = new mongoose.Schema(
  {
    elder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    note: {
      type: String,
      required: true,
    },
    noteType: {
      type: String,
      enum: ["general", "prescription", "followup", "warning", "suggestion"],
      default: "general",
    },
    isVisibleToElder: {
      type: Boolean,
      default: true,
    },
    isVisibleToFamily: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DoctorNote", doctorNoteSchema);
