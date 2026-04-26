const DoctorNote = require("../models/doctorNote");
const User = require("../models/user");

exports.createNote = async (req, res) => {
  try {
    const {
      elderId,
      bookingId,
      note,
      noteType,
      isVisibleToElder,
      isVisibleToFamily,
    } = req.body;

    if (!elderId || !note) {
      return res.status(400).json({
        message: "Elder ID and note are required",
      });
    }

    const doctorUser = await User.findById(req.user.id).select("name");
    if (!doctorUser) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorNote = await DoctorNote.create({
      elder: elderId,
      doctor: req.user.id,
      doctorName: doctorUser.name,
      bookingId: bookingId || undefined,
      note,
      noteType: noteType || "general",
      isVisibleToElder: isVisibleToElder !== false,
      isVisibleToFamily: isVisibleToFamily !== false,
    });

    res.status(201).json({
      message: "Note added successfully",
      doctorNote,
    });
  } catch (error) {
    console.error("createNote error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get notes for an elder (visible to elder and their family)
exports.getNotesForElder = async (req, res) => {
  try {
    const { elderId } = req.params;

    let query = { elder: elderId };

    // If request is from elder, show notes visible to elder
    if (req.user.role === "elder") {
      query.isVisibleToElder = true;
    }
    // If request is from family, show notes visible to family
    else if (req.user.role === "family") {
      // Family can see notes for their linked elders
      query.isVisibleToFamily = true;
      if (req.user.elderIds && req.user.elderIds.length > 0) {
        query.elder = { $in: req.user.elderIds };
      }
    }
    // Doctors see all notes for their patients
    else if (req.user.role === "doctor") {
      // Doctor can see all notes they've created
      query = { doctor: req.user.id };
    }

    const notes = await DoctorNote.find(query)
      .populate("doctor", "name")
      .populate("bookingId", "appointmentDate serviceType")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get notes for a specific patient (for doctors to see their own notes)
exports.getDoctorNotesForPatient = async (req, res) => {
  try {
    const { elderId } = req.params;

    const notes = await DoctorNote.find({ elder: elderId, doctor: req.user.id })
      .populate("doctor", "name")
      .populate("bookingId", "appointmentDate serviceType")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all visible notes for elder/family
// exports.getMyNotes = async (req, res) => {
//   try {
//     let query = {};

//     if (req.user.role === "elder") {
//       // Elder sees their own notes
//       query = { elder: req.user.id, isVisibleToElder: true };
//     } else if (req.user.role === "family") {
//   const familyUser = await User.findById(req.user.id).select("elderIds");

//   if (!familyUser || !familyUser.elderIds || familyUser.elderIds.length === 0) {
//     return res.json({ notes: [] });
//   }

//   query = {
//     elder: { $in: familyUser.elderIds },
//     isVisibleToFamily: true,
//   };
// }
//  else {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     const notes = await DoctorNote.find(query)
//       .populate("doctor", "name")
//       .populate("bookingId", "appointmentDate serviceType")
//       .sort({ createdAt: -1 });

//     res.json({ notes });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getMyNotes = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "elder") {
      query = {
        elder: req.user.id,
        isVisibleToElder: true,
      };
    } else if (req.user.role === "family") {
      const { elderId } = req.query;

      const familyUser = await User.findById(req.user.id).select("elderIds");

      if (
        !familyUser ||
        !familyUser.elderIds ||
        familyUser.elderIds.length === 0
      ) {
        return res.json({ notes: [] });
      }

      const linkedElderIds = familyUser.elderIds.map((id) => id.toString());

      // If family selected one elder, show only that elder's notes
      if (elderId) {
        if (!linkedElderIds.includes(elderId)) {
          return res.status(403).json({
            message: "You are not authorized to view this elder's notes",
          });
        }

        query = {
          elder: elderId,
          isVisibleToFamily: true,
        };
      } else {
        // fallback: show all linked elders
        query = {
          elder: { $in: familyUser.elderIds },
          isVisibleToFamily: true,
        };
      }
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const notes = await DoctorNote.find(query)
      .populate("doctor", "name")
      .populate("bookingId", "appointmentDate serviceType")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error("getMyNotes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a note (only the doctor who created it can delete)
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await DoctorNote.findOne({ _id: noteId, doctor: req.user.id });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    await DoctorNote.findByIdAndDelete(noteId);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
