const Medicine = require("../models/medicine");
const MedicineLog = require("../models/medicineLog");

const User = require("../models/user");
const { sendMedicineReminderEmail } = require("../services/emailService");

const SLOT_VALUES = ["Morning", "Afternoon", "Night"];

const getUserIdFromReq = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

const getDateOnlyString = (date = new Date()) => {
  return new Date(date).toISOString().split("T")[0];
};

const calculateEndDate = (startDate, durationDays) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + Number(durationDays) - 1);
  return date;
};

const isMedicineDateActive = (medicine, today = new Date()) => {
  const current = new Date(today);
  current.setHours(0, 0, 0, 0);

  const start = new Date(medicine.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(medicine.endDate);
  end.setHours(0, 0, 0, 0);

  return current >= start && current <= end;
};

const getTodayStatusMap = async (medicineId, dateStr) => {
  const logs = await MedicineLog.find({
    medicine: medicineId,
    actionDate: dateStr,
    action: { $in: ["taken", "skipped", "missed"] },
  }).sort({ createdAt: -1 });

  const statusMap = {};
  logs.forEach((log) => {
    if (log.slot && !statusMap[log.slot]) {
      statusMap[log.slot] = log.action;
    }
  });

  return statusMap;
};

const getMedicineByIdForUser = async (medicineId, userId) => {
  return Medicine.findOne({
    _id: medicineId,
    user: userId,
    isDeleted: false,
  });
};

// const getPendingMedicineReminders = async (userId) => {
//   const today = getDateOnlyString();
//   const medicines = await Medicine.find({
//     user: userId,
//     isDeleted: false,
//     status: "active",
//   });

//   const reminders = [];

//   for (const medicine of medicines) {
//     if (!isMedicineDateActive(medicine)) continue;

//     const todayStatus = await getTodayStatusMap(medicine._id, today);

//     for (const slot of medicine.scheduleSlots) {
//       if (todayStatus[slot]) continue;

//       reminders.push({
//         email: medicine.userEmail, // or use elder/family email
//         name: medicine.userName,
//         medicineName: medicine.medicineName,
//         dosage: medicine.dosage,
//         slot,
//         dueTime: slot,
//       });
//     }
//   }

//   return reminders;
// };

const getPendingMedicineReminders = async (userId) => {
  const today = getDateOnlyString();
  const user = await User.findById(userId);
  if (!user) return [];

  const targetUserIds = [userId];
  if (user.role === "family" && user.elderIds && user.elderIds.length) {
    targetUserIds.push(...user.elderIds);
  }

  const medicines = await Medicine.find({
    user: { $in: targetUserIds },
    isDeleted: false,
    status: "active",
  });

  const reminders = [];

  for (const medicine of medicines) {
    if (!isMedicineDateActive(medicine)) continue;

    const todayStatus = await getTodayStatusMap(medicine._id, today);
    const elder = await User.findById(medicine.user);

    for (const slot of medicine.scheduleSlots) {
      if (todayStatus[slot]) continue;

      reminders.push({
        elderName: elder?.name || "Elder",
        medicineName: medicine.medicineName,
        dosage: medicine.dosage,
        slot,
        dueTime: slot,
      });
    }
  }

  return reminders;
};

exports.sendMedicineRemindersForUser = async (userId, email, name) => {
  if (!email) return;

  const reminders = await getPendingMedicineReminders(userId);
  if (!reminders.length) return;

  await Promise.all(
    reminders.map((reminder) =>
      sendMedicineReminderEmail(
        email,
        name || "User",
        reminder.elderName,
        reminder.medicineName,
        reminder.dosage,
        reminder.slot,
        reminder.dueTime,
      ),
    ),
  );
};

exports.createMedicine = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    // Allow family members and doctors to add medicine for their elder
    let elderUserId = userId;
    if (req.user.role === "family" || req.user.role === "doctor") {
      if (!req.body.elderId) {
        return res
          .status(400)
          .json({ message: "Elder ID is required for family/doctor members." });
      }
      elderUserId = req.body.elderId;
    }

    const {
      medicineName,
      medicineType,
      dosage,
      scheduleSlots,
      startDate,
      durationDays,
      currentStock,
      initialStock,
      lowStockThreshold,
      notes,
    } = req.body;

    if (!medicineName || !dosage || !startDate || !durationDays) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    if (!Array.isArray(scheduleSlots) || !scheduleSlots.length) {
      return res
        .status(400)
        .json({ message: "At least one schedule slot is required." });
    }

    const invalidSlot = scheduleSlots.some(
      (slot) => !SLOT_VALUES.includes(slot),
    );
    if (invalidSlot) {
      return res
        .status(400)
        .json({ message: "Invalid schedule slot selected." });
    }

    const medicine = await Medicine.create({
      user: elderUserId,
      medicineName,
      medicineType,
      dosage,
      scheduleSlots,
      startDate,
      durationDays: Number(durationDays),
      endDate: calculateEndDate(startDate, durationDays),
      currentStock: Number(currentStock),
      initialStock: Number(initialStock ?? currentStock),
      lowStockThreshold: Number(lowStockThreshold || 5),
      notes,
      status: "active",
      addedBy: req.user.role,
    });

    await MedicineLog.create({
      medicine: medicine._id,
      user: elderUserId,
      action: "updated",
      quantityChanged: 0,
      note: "Medicine created",
      actionDate: getDateOnlyString(),
    });

    return res.status(201).json({
      message: "Medicine added successfully.",
      medicine,
    });
  } catch (error) {
    console.error("createMedicine error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating medicine." });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const { elderId } = req.query;
    let query = { isDeleted: false };

    // If elderId is provided, get medicines for that elder
    // If no elderId, get medicines for current user (for elders) or their linked elders (for family)
    if (elderId) {
      query.user = elderId;
    } else {
      // For family members and doctors, handle accordingly
      const User = require("../models/user");
      const user = await User.findById(userId);
      if (user.role === "family" && user.elderIds && user.elderIds.length > 0) {
        query.user = { $in: user.elderIds };
      } else if (user.role === "doctor") {
        // Doctors need to specify elderId to view medicines
        return res
          .status(400)
          .json({ message: "Elder ID is required for doctors" });
      } else {
        query.user = userId;
      }
    }

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });

    const today = getDateOnlyString();

    const enrichedMedicines = await Promise.all(
      medicines.map(async (medicine) => {
        let computedStatus = medicine.status;

        if (medicine.status !== "paused" && !isMedicineDateActive(medicine)) {
          if (new Date(medicine.endDate) < new Date()) {
            computedStatus = "completed";
          }
        }

        const todayStatus = await getTodayStatusMap(medicine._id, today);

        return {
          ...medicine.toObject(),
          status: computedStatus,
          todayStatus,
        };
      }),
    );

    return res.status(200).json({ medicines: enrichedMedicines });
  } catch (error) {
    console.error("getMedicines error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching medicines." });
  }
};

exports.getMedicineHistory = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    const history = await MedicineLog.find({
      medicine: req.params.id,
      user: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ history });
  } catch (error) {
    console.error("getMedicineHistory error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching history." });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    const {
      medicineName,
      medicineType,
      dosage,
      scheduleSlots,
      startDate,
      durationDays,
      currentStock,
      lowStockThreshold,
      notes,
      status,
    } = req.body;

    if (
      scheduleSlots &&
      (!Array.isArray(scheduleSlots) || !scheduleSlots.length)
    ) {
      return res
        .status(400)
        .json({ message: "At least one schedule slot is required." });
    }

    if (scheduleSlots) {
      const invalidSlot = scheduleSlots.some(
        (slot) => !SLOT_VALUES.includes(slot),
      );
      if (invalidSlot) {
        return res
          .status(400)
          .json({ message: "Invalid schedule slot selected." });
      }
    }

    medicine.medicineName = medicineName ?? medicine.medicineName;
    medicine.medicineType = medicineType ?? medicine.medicineType;
    medicine.dosage = dosage ?? medicine.dosage;
    medicine.scheduleSlots = scheduleSlots ?? medicine.scheduleSlots;
    medicine.startDate = startDate ?? medicine.startDate;
    medicine.durationDays = Number(durationDays ?? medicine.durationDays);
    medicine.currentStock =
      currentStock !== undefined ? Number(currentStock) : medicine.currentStock;
    medicine.lowStockThreshold =
      lowStockThreshold !== undefined
        ? Number(lowStockThreshold)
        : medicine.lowStockThreshold;
    medicine.notes = notes ?? medicine.notes;
    medicine.status = status ?? medicine.status;
    medicine.endDate = calculateEndDate(
      medicine.startDate,
      medicine.durationDays,
    );

    await medicine.save();

    await MedicineLog.create({
      medicine: medicine._id,
      user: userId,
      action: "updated",
      quantityChanged: 0,
      note: "Medicine updated",
      actionDate: getDateOnlyString(),
    });

    return res.status(200).json({
      message: "Medicine updated successfully.",
      medicine,
    });
  } catch (error) {
    console.error("updateMedicine error:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating medicine." });
  }
};

exports.takeMedicineSlot = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const { slot } = req.body;

    if (!slot || !SLOT_VALUES.includes(slot)) {
      return res.status(400).json({ message: "Valid slot is required." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    if (medicine.status !== "active") {
      return res
        .status(400)
        .json({ message: "Only active medicines can be taken." });
    }

    if (!isMedicineDateActive(medicine)) {
      return res
        .status(400)
        .json({ message: "Medicine is not active for today's date." });
    }

    if (!medicine.scheduleSlots.includes(slot)) {
      return res
        .status(400)
        .json({ message: "This slot is not configured for the medicine." });
    }

    if (medicine.currentStock <= 0) {
      return res
        .status(400)
        .json({ message: "No stock left for this medicine." });
    }

    const today = getDateOnlyString();

    const existingTaken = await MedicineLog.findOne({
      medicine: medicine._id,
      user: userId,
      slot,
      actionDate: today,
      action: "taken",
    });

    if (existingTaken) {
      return res
        .status(400)
        .json({ message: "This slot is already marked as taken today." });
    }

    medicine.currentStock = Math.max(0, medicine.currentStock - 1);
    await medicine.save();

    await MedicineLog.create({
      medicine: medicine._id,
      user: userId,
      action: "taken",
      slot,
      quantityChanged: -1,
      note: `${slot} dose taken`,
      actionDate: today,
    });

    return res.status(200).json({
      message: `${slot} medicine marked as taken.`,
      currentStock: medicine.currentStock,
    });
  } catch (error) {
    console.error("takeMedicineSlot error:", error);
    return res
      .status(500)
      .json({ message: "Server error while taking medicine." });
  }
};

exports.skipMedicineSlot = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const { slot } = req.body;

    if (!slot || !SLOT_VALUES.includes(slot)) {
      return res.status(400).json({ message: "Valid slot is required." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    if (!medicine.scheduleSlots.includes(slot)) {
      return res
        .status(400)
        .json({ message: "This slot is not configured for the medicine." });
    }

    const today = getDateOnlyString();

    const existingTaken = await MedicineLog.findOne({
      medicine: medicine._id,
      user: userId,
      slot,
      actionDate: today,
      action: "taken",
    });

    if (existingTaken) {
      return res
        .status(400)
        .json({ message: "Already taken for this slot. Cannot skip now." });
    }

    const existingSkipped = await MedicineLog.findOne({
      medicine: medicine._id,
      user: userId,
      slot,
      actionDate: today,
      action: "skipped",
    });

    if (existingSkipped) {
      return res
        .status(400)
        .json({ message: "This slot is already skipped today." });
    }

    await MedicineLog.create({
      medicine: medicine._id,
      user: userId,
      action: "skipped",
      slot,
      quantityChanged: 0,
      note: `${slot} dose skipped`,
      actionDate: today,
    });

    return res.status(200).json({
      message: `${slot} medicine marked as skipped.`,
    });
  } catch (error) {
    console.error("skipMedicineSlot error:", error);
    return res
      .status(500)
      .json({ message: "Server error while skipping medicine." });
  }
};

exports.refillMedicineStock = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const { refillQuantity } = req.body;

    if (!refillQuantity || Number(refillQuantity) <= 0) {
      return res
        .status(400)
        .json({ message: "Valid refill quantity is required." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    medicine.currentStock += Number(refillQuantity);
    medicine.initialStock += Number(refillQuantity);

    if (medicine.status === "completed") {
      medicine.status = "active";
    }

    await medicine.save();

    await MedicineLog.create({
      medicine: medicine._id,
      user: userId,
      action: "refill",
      quantityChanged: Number(refillQuantity),
      note: `Stock refilled by ${refillQuantity}`,
      actionDate: getDateOnlyString(),
    });

    return res.status(200).json({
      message: "Medicine stock refilled successfully.",
      currentStock: medicine.currentStock,
      initialStock: medicine.initialStock,
    });
  } catch (error) {
    console.error("refillMedicineStock error:", error);
    return res
      .status(500)
      .json({ message: "Server error while refilling stock." });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const medicine = await getMedicineByIdForUser(req.params.id, userId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    medicine.isDeleted = true;
    medicine.deletedAt = new Date();

    await medicine.save();

    await MedicineLog.create({
      medicine: medicine._id,
      user: userId,
      action: "deleted",
      quantityChanged: 0,
      note: "Medicine deleted",
      actionDate: getDateOnlyString(),
    });

    return res.status(200).json({ message: "Medicine deleted successfully." });
  } catch (error) {
    console.error("deleteMedicine error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting medicine." });
  }
};

exports.getUpcomingReminders = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const today = getDateOnlyString();

    const medicines = await Medicine.find({
      user: userId,
      isDeleted: false,
      status: "active",
    }).sort({ createdAt: -1 });

    const reminders = [];

    for (const medicine of medicines) {
      if (!isMedicineDateActive(medicine)) continue;

      const todayStatus = await getTodayStatusMap(medicine._id, today);

      for (const slot of medicine.scheduleSlots) {
        reminders.push({
          _id: `${medicine._id}-${slot}`,
          medicineId: medicine._id,
          medicineName: medicine.medicineName,
          medicineType: medicine.medicineType,
          dosage: medicine.dosage,
          slot,
          currentStock: medicine.currentStock,
          initialStock: medicine.initialStock,
          status: todayStatus[slot] || "pending",
          lowStock:
            Number(medicine.currentStock) <=
            Number(medicine.lowStockThreshold || 5),
        });
      }
    }

    return res.status(200).json({
      reminders,
    });
  } catch (error) {
    console.error("getUpcomingReminders error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching reminders." });
  }
};

exports.autoMarkMissedDoses = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "User not found in token." });
    }

    const today = getDateOnlyString();

    const medicines = await Medicine.find({
      user: userId,
      isDeleted: false,
      status: "active",
    });

    let missedCount = 0;

    for (const medicine of medicines) {
      if (!isMedicineDateActive(medicine)) continue;

      for (const slot of medicine.scheduleSlots) {
        const existing = await MedicineLog.findOne({
          medicine: medicine._id,
          user: userId,
          slot,
          actionDate: today,
          action: { $in: ["taken", "skipped", "missed"] },
        });

        if (!existing) {
          await MedicineLog.create({
            medicine: medicine._id,
            user: userId,
            action: "missed",
            slot,
            quantityChanged: 0,
            note: `${slot} dose missed`,
            actionDate: today,
          });
          missedCount += 1;
        }
      }
    }

    return res.status(200).json({
      message: "Missed doses processed successfully.",
      missedCount,
    });
  } catch (error) {
    console.error("autoMarkMissedDoses error:", error);
    return res
      .status(500)
      .json({ message: "Server error while marking missed doses." });
  }
};

// exports.sendMedicineReminders = async (req, res) => {
//   try {
//     const userId = getUserIdFromReq(req);
//     if (!userId) return res.status(401).json({ message: "User not found." });

//     const user = await User.findById(userId);
//     const reminders = await getPendingMedicineReminders(userId);

//     await Promise.all(
//       reminders.map((reminder) =>
//         sendMedicineReminderEmail(
//           user.email,
//           user.name || "User",
//           reminder.medicineName,
//           reminder.dosage,
//           reminder.slot,
//           reminder.dueTime,
//         ),
//       ),
//     );

//     return res.status(200).json({ message: "Medicine reminders sent." });
//   } catch (error) {
//     console.error("sendMedicineReminders error:", error);
//     return res.status(500).json({ message: "Failed to send reminders." });
//   }
// };
