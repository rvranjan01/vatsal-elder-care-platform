const Medicine = require("../models/medicine");

exports.addMedicine = async (req, res) => {
  try {
    const { medicineName, dosage, time, frequency, notes } = req.body;

    const medicine = await Medicine.create({
      user: req.user.id, // use the authenticated user's ID
      medicineName,
      dosage,
      time,
      frequency,
      notes
    });

    res.status(201).json({
      message: "Medicine added successfully",
      medicine
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate("user", "name email");
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
