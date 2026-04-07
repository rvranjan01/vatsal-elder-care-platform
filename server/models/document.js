const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    elderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: ["Prescription", "Report", "Insurance", "Medical History", "Other"],
      default: "Other",
    },
    uploadedBy: {
      type: String,
      default: "family",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
