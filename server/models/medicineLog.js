

const mongoose = require("mongoose");

const medicineLogSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["taken", "skipped", "missed", "refill", "updated", "deleted"],
      required: true,
    },
    slot: {
      type: String,
      enum: ["Morning", "Afternoon", "Night", null],
      default: null,
    },
    quantityChanged: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    actionDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicineLog", medicineLogSchema);