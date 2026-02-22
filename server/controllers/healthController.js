const Health = require("../models/health");

// exports.addHealthData = async (req, res) => {
//   try {
//     const { bloodPressure, sugarLevel, notes } = req.body;

//     const health = await Health.create({
//       user: req.user.id, // comes from JWT
//       bloodPressure,
//       sugarLevel,
//       notes
//     });

//     res.status(201).json({
//       message: "Health data added successfully",
//       health
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



exports.addHealthData = async (req, res) => {
  try {
    // Only elder can add health data
    if (req.user.role !== "elder") {
      return res.status(403).json({
        message: "Only elder can add health data"
      });
    }

    const { bloodPressure, sugarLevel, notes } = req.body;

    const health = await Health.create({
      user: req.user.id, // elder ID from JWT
      bloodPressure,
      sugarLevel,
      notes
    });

    res.status(201).json({
      message: "Health data added successfully",
      health
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.getHealthData = async (req, res) => {
//   try {
//     let healthData;

//     if (req.user.role === "elder") {
//       // elder sees own data
//       healthData = await Health.find({ user: req.user.id }).sort({ createdAt: -1 });
//     } else {
//       // family sees all linked elder data (for now: all records)
//       healthData = await Health.find().populate("user", "name email");
//     }

//     res.status(200).json(healthData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getHealthData = async (req, res) => {
  try {
    let healthData;

    if (req.user.role === "elder") {
      // Elder sees own data
      healthData = await Health.find({
        user: req.user.id
      }).sort({ createdAt: -1 });

    } else if (req.user.role === "family") {
      // Family sees ONLY linked elder data
      healthData = await Health.find({
        user: req.user.elderId
      }).sort({ createdAt: -1 });
    }

    res.status(200).json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.deleteHealthData = async (req, res) => {
//   try {
//     const healthId = req.params.id;
//     await Health.findByIdAndDelete(healthId);
//     res.status(200).json({ message: "Health data deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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
        message: "Not authorized"
      });
    }

    await Health.findByIdAndDelete(healthId);

    res.status(200).json({ message: "Health data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
