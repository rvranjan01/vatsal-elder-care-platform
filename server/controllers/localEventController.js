const LocalEvent = require("../models/localEvent");

// ADMIN CONTROLLER METHODS
exports.getAdminEvents = async (req, res) => {
  try {
    const events = await LocalEvent.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = new LocalEvent(req.body);
    const newEvent = await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Validation error",
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await LocalEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Update failed",
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await LocalEvent.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// PUBLIC CONTROLLER (for Elders)
exports.getPublicEvents = async (req, res) => {
  try {
    const events = await LocalEvent.find().sort({ date: 1 }).limit(10);

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
