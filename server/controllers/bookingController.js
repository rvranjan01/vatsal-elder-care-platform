const Booking = require("../models/booking");
const User = require("../models/user");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      elderId,
      elderName,
      serviceType,
      doctorName,
      specialty,
      consultationType,
      appointmentDate,
      timeSlot,
      reason,
      medicalHistory,
      currentMedications,
      notes,
      providerId,
    } = req.body;

    // Determine the elder for whom the booking is created
    let targetElder = elderId;
    if (req.user.role === "elder") targetElder = req.user.id;

    if (!targetElder) {
      return res.status(400).json({ message: "Elder ID is required" });
    }

    // If the requester is family, ensure the elder is linked to them
    if (req.user.role === "family") {
      const user = await require("../models/user").findById(req.user.id);
      const linked =
        (user.elderIds &&
          user.elderIds.map(String).includes(String(targetElder))) ||
        (user.elderId && String(user.elderId) === String(targetElder));
      if (!linked)
        return res
          .status(403)
          .json({ message: "Not authorized to book for this elder" });
    }

    // Basic validation based on service type

    if (serviceType === "Doctor") {
      // If providerId is provided, doctor details will be set automatically
      if (providerId) {
        // Validation will happen when provider is looked up
      } else {
        // Manual doctor booking - require doctorName
        if (!doctorName) {
          return res.status(400).json({ message: "Doctor name is required" });
        }
      }

      if (!consultationType || !appointmentDate || !timeSlot || !reason) {
        return res.status(400).json({
          message: "Please provide all required fields for doctor appointment",
        });
      }

      // Still require future date
      if (new Date(appointmentDate) < new Date()) {
        return res
          .status(400)
          .json({ message: "Appointment date must be in the future" });
      }
    } else if (serviceType === "Companion") {
      if (!appointmentDate || !timeSlot)
        return res.status(400).json({
          message: "Please provide date and time for companion booking",
        });
      if (new Date(appointmentDate) < new Date())
        return res
          .status(400)
          .json({ message: "Appointment date must be in the future" });
    } else if (serviceType === "Event") {
      if (!appointmentDate)
        return res.status(400).json({ message: "Event date is required" });
    }

    // Handle provider assignment
    let companionName, nurseName, assignedProvider;
    if (providerId) {
      const provider = await User.findById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Verify provider role matches service type
      if (serviceType === "Companion" && provider.role !== "companion") {
        return res
          .status(400)
          .json({ message: "Invalid provider for companion booking" });
      }
      if (serviceType === "Nurse" && provider.role !== "nurse") {
        return res
          .status(400)
          .json({ message: "Invalid provider for nurse booking" });
      }
      if (serviceType === "Doctor" && provider.role !== "doctor") {
        return res
          .status(400)
          .json({ message: "Invalid provider for doctor booking" });
      }

      assignedProvider = providerId;
      if (serviceType === "Companion") companionName = provider.name;
      if (serviceType === "Nurse") nurseName = provider.name;
      if (serviceType === "Doctor") {
        doctorName = provider.name;
        specialty = specialty || provider.specialty || "General";
      }
    }

    console.log("Creating booking with user:", req.user?.id);
    console.log("Creating booking with elder:", targetElder);
    const booking = await Booking.create({
      user: req.user.id,
      elder: targetElder,
      elderName: elderName || undefined,
      serviceType: serviceType || "Doctor",
      doctorName,
      specialty,
      consultationType,
      companionName,
      nurseName,
      assignedProvider,
      appointmentDate,
      timeSlot,
      reason,
      medicalHistory,
      currentMedications,
      notes,
    });

    // 📧 SEND EMAIL TO PROVIDER (Doctor/Nurse/Companion)
try {
  const {
    sendBookingConfirmationEmail,
  } = require("../services/emailService");

  if (assignedProvider) {
    const provider = await User.findById(assignedProvider);

    if (provider?.email) {
      await sendBookingConfirmationEmail(
        provider.email,
        provider.name,
        elderName || "Elder",
        appointmentDate
      );
    }
  }
} catch (err) {
  console.error("Email error (booking request):", err.message);
}

    // Emit socket event for new booking
    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("bookingCreated", {
          bookingId: booking._id,
          user: req.user.id,
          elder: booking.elder,
          serviceType: booking.serviceType,
          appointmentDate: booking.appointmentDate,
          timeSlot: booking.timeSlot,
          createdAt: booking.createdAt,
        });
      }
    } catch (e) {
      console.error("Socket emit error (bookingCreated):", e);
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings for the logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    let bookings;

    // If elder requests -> return bookings where elder == user
    if (req.user.role === "elder") {
      bookings = await Booking.find({ elder: req.user.id }).sort({
        appointmentDate: 1,
      });
    } else if (req.user.role === "family") {
      // If family passes elderId as query param, return bookings for that elder (ensure linked)
      const elderId = req.query.elderId;
      if (elderId) {
        const user = await require("../models/user").findById(req.user.id);
        const linked =
          (user.elderIds &&
            user.elderIds.map(String).includes(String(elderId))) ||
          (user.elderId && String(user.elderId) === String(elderId));
        if (!linked)
          return res
            .status(403)
            .json({ message: "Not authorized to view this elder bookings" });
        bookings = await Booking.find({ elder: elderId }).sort({
          appointmentDate: 1,
        });
      } else {
        // otherwise return bookings created by the family user
        bookings = await Booking.find({ user: req.user.id }).sort({
          appointmentDate: 1,
        });
      }
    } else {
      // other roles -> return bookings created by them
      bookings = await Booking.find({ user: req.user.id }).sort({
        appointmentDate: 1,
      });
    }

    res
      .status(200)
      .json({ message: "Bookings retrieved successfully", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings (admin/view purpose)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      message: "All bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow user to view their own booking
    if (booking.user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }

    res.status(200).json({
      message: "Booking retrieved successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow user to update their own booking
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    // Don't allow updating completed or cancelled bookings
    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: `Cannot update ${booking.status} booking` });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow user to cancel their own booking
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: `Cannot cancel ${booking.status} booking` });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow user to delete their own booking
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get pending bookings for provider (requires confirmation)
exports.getPendingBookingsForProvider = async (req, res) => {
  try {
    const providerRoles = ["doctor", "companion", "nurse"];
    if (!providerRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only providers can access this" });
    }

    let query = {
      confirmationStatus: "Waiting",
      serviceType:
        req.user.role === "doctor"
          ? "Doctor"
          : req.user.role === "nurse"
            ? "Nurse"
            : "Companion",
      $or: [
        { assignedProvider: req.user.id },
        { assignedProvider: { $exists: false } },
        { assignedProvider: null },
      ],
    };

    const bookings = await Booking.find(query)
      .populate("elder", "name username")
      .sort({ appointmentDate: 1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Provider confirms a booking
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const providerRoles = ["doctor", "companion", "nurse"];
    if (!providerRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only providers can confirm bookings" });
    }

    booking.confirmationStatus = "Confirmed";
    booking.confirmedBy = req.user.id;
    booking.status = "Confirmed";
    await booking.save();

    // 📧 SEND CONFIRMATION EMAIL TO USER/FAMILY
try {
  const { sendBookingConfirmedEmail } = require("../services/emailService");

  const user = await User.findById(booking.user);

  if (user?.email) {
    await sendBookingConfirmedEmail(
      user.email,
      user.name,
      booking.elderName || "Elder",
      booking.appointmentDate
    );
  }
} catch (err) {
  console.error("Email error (confirmation):", err.message);
}

    // Emit socket event for booking confirmation
    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("bookingConfirmed", {
          bookingId: booking._id,
          confirmedBy: req.user.id,
          elder: booking.elder,
          serviceType: booking.serviceType,
          confirmedAt: booking.updatedAt || new Date(),
        });
      }
    } catch (e) {
      console.error("Socket emit error (bookingConfirmed):", e);
    }

    const { sendBookingConfirmedEmail } = require("../services/emailService");
    // Send confirmation email to family (would need booking creator's email)

    res
      .status(200)
      .json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Provider rejects a booking
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const providerRoles = ["doctor", "companion", "nurse"];
    if (!providerRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only providers can reject bookings" });
    }

    booking.confirmationStatus = "Rejected";
    booking.status = "Cancelled";
    await booking.save();

    // 📧 SEND REJECTION EMAIL
try {
  const { sendBookingRejectedEmail } = require("../services/emailService");

  const user = await User.findById(booking.user);

  if (user?.email) {
    await sendBookingRejectedEmail(
      user.email,
      user.name,
      booking.elderName || "Elder",
      reason || ""
    );
  }
} catch (err) {
  console.error("Email error (rejection):", err.message);
}

    // Emit socket event for booking rejection
    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("bookingRejected", {
          bookingId: booking._id,
          elder: booking.elder,
          serviceType: booking.serviceType,
          rejectedAt: booking.updatedAt || new Date(),
        });
      }
    } catch (e) {
      console.error("Socket emit error (bookingRejected):", e);
    }

    // Send rejection email to family

    res.status(200).json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.bookCompanion = async (req, res) => {
  try {
    const { companionId, elderName, appointmentDate, timeSlot, notes } =
      req.body;

    const companion = await User.findOne({
      _id: companionId,
      role: "companion",
    });

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: "Companion not found",
      });
    }

    const booking = new Booking({
      user: req.user.id,
      elder: req.user.id,
      elderName,
      serviceType: "Companion",
      appointmentDate,
      timeSlot,
      notes,
      status: "Pending",
      confirmationStatus: "Waiting",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Companion booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error booking companion:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while booking companion",
    });
  }
};

exports.bookNurse = async (req, res) => {
  try {
    const {
      nurseId,
      elderName,
      elderAge,
      appointmentDate,
      timeSlot,
      address,
      careType,
      medicalNeeds,
      notes,
    } = req.body;

    if (
      !nurseId ||
      !elderName ||
      !appointmentDate ||
      !timeSlot ||
      !address ||
      !careType ||
      !medicalNeeds
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required nurse booking fields" });
    }

    const nurse = await User.findById(nurseId);
    if (!nurse || nurse.role !== "nurse") {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      elder: req.user.id,
      elderName,
      elderAge,
      serviceType: "Nurse",
      appointmentDate,
      timeSlot,
      address,
      careType,
      medicalNeeds,
      notes,
      status: "Pending",
      confirmationStatus: "Waiting",
    });

    res.status(201).json({
      success: true,
      message: "Nurse booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Book nurse error:", error);
    res.status(500).json({ message: "Server error while booking nurse" });
  }
};
