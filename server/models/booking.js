const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Link the booking to the elder's user id (so elder can see bookings)
    elder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    elderName: {
      type: String
    },
    // serviceType can be 'Doctor' (medical appointment), 'Companion' (caregiver), or 'Event'
    serviceType: {
      type: String,
      enum: ["Doctor", "Companion","Nurse", "Event"],
      default: "Doctor"
    },
    doctorName: {
      type: String
    },
    specialty: {
      type: String,
      enum: ["General", "Cardiologist", "Orthopedist", "Neurologist", "Dermatologist", "Pediatrician", "Psychiatrist", "Dentist"],
    },
    consultationType: {
      type: String,
      enum: ["In-person", "Video Call", "Home Visit"]
    },
    appointmentDate: {
      type: Date
    },
    timeSlot: {
      type: String,
      enum: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    reason: {
      type: String
    },
    medicalHistory: {
      type: String
    },
    currentMedications: {
      type: String
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ["Pending", "Pending Confirmation", "Confirmed", "Completed", "Cancelled", "Rejected"],
      default: "Pending"
    },
    // Provider confirmation (for non-doctor bookings, this tracks if provider accepted)
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    confirmationStatus: {
      type: String,
      enum: ["Waiting", "Confirmed", "Rejected"],
      default: "Waiting"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

