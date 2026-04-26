const Health = require("../models/health");

exports.addHealthData = async (req, res) => {
  try {
    let elderUserId = req.user.id;
    let addedBy = req.user.role;

    if (req.user.role === "family" || req.user.role === "doctor") {
      if (!req.body.elderId) {
        return res.status(400).json({
          message: "Elder ID is required for family/doctor members",
        });
      }
      elderUserId = req.body.elderId;
    }

    const { bloodPressure, sugarLevel, notes } = req.body;

    const health = await Health.create({
      user: elderUserId,
      bloodPressure,
      sugarLevel,
      notes,
      addedBy,
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
    let healthData;

    if (req.user.role === "elder") {
      healthData = await Health.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });
    } else if (req.user.role === "family") {
      let elderId;

      if (req.query.elderUsername) {
        console.log(
          "🔍 Looking up elder by username:",
          req.query.elderUsername,
        );

        const Elder = require("../models/elder");
        const elder = await Elder.findOne({
          username: req.query.elderUsername,
        });

        if (!elder) {
          return res.status(404).json({ message: "Elder username not found" });
        }

        elderId = elder._id;
        console.log("🔍 Found elderId:", elderId);
      } else if (req.query.elderId) {
        elderId = req.query.elderId;
        console.log("🔍 Using direct elderId:", elderId);
      } else if (req.user.elderIds && req.user.elderIds[0]) {
        elderId = req.user.elderIds[0];
        console.log("🔍 Using first JWT elderId:", elderId);
      } else {
        return res.status(400).json({ message: "No elder specified" });
      }

      healthData = await Health.find({
        user: elderId,
      }).sort({ createdAt: -1 });
    } else if (req.user.role === "doctor") {
      if (!req.query.elderId) {
        return res.status(400).json({
          message: "Elder ID is required for doctors",
        });
      }

      healthData = await Health.find({
        user: req.query.elderId,
      }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: "Not authorized" });
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
