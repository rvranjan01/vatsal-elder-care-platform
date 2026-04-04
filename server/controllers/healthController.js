const Health = require("../models/health");

exports.addHealthData = async (req, res) => {
  try {
    // Only elder can add health data
    if (req.user.role !== "elder") {
      return res.status(403).json({
        message: "Only elder can add health data",
      });
    }

    const { bloodPressure, sugarLevel, notes } = req.body;

    const health = await Health.create({
      user: req.user.id, // elder ID from JWT
      bloodPressure,
      sugarLevel,
      notes,
    });

    res.status(201).json({
      message: "Health data added successfully",
      health,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHealthData = async (req, res) => {
  try {
    // console.log('🔍 req.user.elderIds:', req.user.elderIds);
    // console.log('🔍 req.query.elderId:', req.query.elderId);
    // console.log('🔍 req.query.elderUsername:', req.query.elderUsername);
    // console.log('🔍 req.user.role:', req.user.role);

    let healthData;

    if (req.user.role === "elder") {
      // Elder sees own data
      healthData = await Health.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });
    } else if (req.user.role === "family") {
      let elderId;

      // Try elderUsername first (your username mapping system)
      if (req.query.elderUsername) {
        console.log(
          "🔍 Looking up elder by username:",
          req.query.elderUsername,
        );
        const Elder = require("../models/elder"); // Add Elder model
        const elder = await Elder.findOne({
          username: req.query.elderUsername,
        });
        if (!elder) {
          return res.status(404).json({ message: "Elder username not found" });
        }
        elderId = elder._id;
        console.log("🔍 Found elderId:", elderId);

        // Fallback to elderId from frontend (existing system)
      } else if (req.query.elderId) {
        elderId = req.query.elderId;
        console.log("🔍 Using direct elderId:", elderId);

        // Last resort: first elder from JWT
      } else if (req.user.elderIds && req.user.elderIds[0]) {
        elderId = req.user.elderIds[0];
        console.log("🔍 Using first JWT elderId:", elderId);
      } else {
        return res.status(400).json({ message: "No elder specified" });
      }

      // Fetch health data for resolved elderId
      healthData = await Health.find({
        user: elderId,
      }).sort({ createdAt: -1 });
    }

    res.status(200).json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteHealthData = async (req, res) => {
  try {
    const healthId = req.params.id;

    const health = await Health.findById(healthId);
    if (!health) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Only elder who owns the data can delete
    if (health.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Health.findByIdAndDelete(healthId);

    res.status(200).json({ message: "Health data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
