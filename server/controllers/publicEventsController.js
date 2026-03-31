const LocalEvent = require('../models/localEvent');

exports.getPublicLocalEvents = async (req, res) => {
  try {
    const events = await LocalEvent.find()
      .sort({ date: 1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};