const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    medicineType: {
      type: String,
      enum: ["tablet", "capsule", "injection"],
      default: "tablet",
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    scheduleSlots: [
      {
        type: String,
        enum: ["Morning", "Afternoon", "Night"],
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    initialStock: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    addedBy: {
      type: String,
      enum: ["elder", "family", "doctor"],
      default: "elder",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Medicine", medicineSchema);
