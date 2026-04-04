const LocalEvent = require("../models/localEvent");

// Get all local events (admin)
exports.getLocalEvents = async (req, res) => {
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
    });
  }
};

// Create new local event (admin)
exports.createLocalEvent = async (req, res) => {
  try {
    const event = new LocalEvent({
      ...req.body,
    });

    const createdEvent = await event.save();

    res.status(201).json({
      success: true,
      event: createdEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update local event (admin)
exports.updateLocalEvent = async (req, res) => {
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
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete local event (admin)
exports.deleteLocalEvent = async (req, res) => {
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
    });
  }
};
