const User = require("../models/user");
const CareNote = require("../models/careNote");
const Document = require("../models/document");
const ActivityLog = require("../models/activityLog");
const FamilyMessage = require("../models/familyMessage");
const mongoose = require("mongoose");

// Link Elder by Username
exports.linkElderByUsername = async (req, res) => {
  try {
    const { elderUsername } = req.body;
    const familyId = req.user.id;

    if (!elderUsername) {
      return res.status(400).json({ message: "Elder username is required" });
    }

    // Find elder by username
    const elder = await User.findOne({
      username: elderUsername,
      role: "elder",
    });

    if (!elder) {
      return res
        .status(404)
        .json({ message: "Elder with this username not found" });
    }

    // Get current family
    const family = await User.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    // Check if already linked
    if (family.elderIds.includes(elder._id)) {
      return res.status(400).json({ message: "Elder already linked" });
    }

    // Link elder
    family.elderIds.push(elder._id);
    await family.save();

    // Log activity
    await ActivityLog.create({
      elderId: elder._id,
      activityType: "Other",
      description: `Linked to family member: ${family.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Elder linked successfully",
      elder: {
        _id: elder._id,
        name: elder.name,
        username: elder.username,
      },
    });
  } catch (err) {
    console.error("Link elder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all care notes for a specific elder
exports.getCareNotes = async (req, res) => {
  try {
    const { elderId } = req.params;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const notes = await CareNote.find({ elderId, familyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(notes);
  } catch (err) {
    console.error("Get care notes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create care note
exports.createCareNote = async (req, res) => {
  try {
    const { elderId, title, content, category, priority } = req.body;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const note = await CareNote.create({
      elderId,
      familyId,
      title,
      content,
      category,
      priority,
    });

    // Log activity
    await ActivityLog.create({
      elderId,
      activityType: "Note",
      description: `Care note added: ${title}`,
      relatedId: note._id,
    });

    return res.status(201).json(note);
  } catch (err) {
    console.error("Create care note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete care note
exports.deleteCareNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const familyId = req.user.id;

    const note = await CareNote.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.familyId.toString() !== familyId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await CareNote.findByIdAndDelete(noteId);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete care note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get documents for elder
exports.getDocuments = async (req, res) => {
  try {
    const { elderId } = req.params;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = await Document.find({ elderId, familyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(documents);
  } catch (err) {
    console.error("Get documents error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Upload document (mock - in real app you'd use multer)
exports.uploadDocument = async (req, res) => {
  try {
    const { elderId, fileName, documentType, description } = req.body;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // In real app, handle file upload here
    const fileUrl = `/uploads/documents/${Date.now()}-${fileName}`;

    const document = await Document.create({
      elderId,
      familyId,
      fileName,
      fileUrl,
      documentType,
      description,
      uploadedBy: "family",
    });

    // Log activity
    await ActivityLog.create({
      elderId,
      activityType: "Document",
      description: `Document uploaded: ${fileName}`,
      relatedId: document._id,
    });

    return res.status(201).json(document);
  } catch (err) {
    console.error("Upload document error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const familyId = req.user.id;

    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.familyId.toString() !== familyId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Document.findByIdAndDelete(docId);

    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete document error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get activity log for elder
exports.getActivityLog = async (req, res) => {
  try {
    const { elderId } = req.params;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const activities = await ActivityLog.find({ elderId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(activities);
  } catch (err) {
    console.error("Get activity log error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Send message to elder
exports.sendMessage = async (req, res) => {
  try {
    const { elderId, message, messageType } = req.body;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const familyMessage = await FamilyMessage.create({
      elderId,
      familyId,
      message,
      messageType,
    });

    // Log activity
    await ActivityLog.create({
      elderId,
      activityType: "Note",
      description: `Message from family: ${messageType}`,
      relatedId: familyMessage._id,
    });

    return res.status(201).json(familyMessage);
  } catch (err) {
    console.error("Send message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create event for linked elder
exports.createFamilyEvent = async (req, res) => {
  try {
    const { elderId, title, description, location, date, time, type } =
      req.body;
    const familyId = req.user.id;

    if (!elderId || !title || !location || !date) {
      return res
        .status(400)
        .json({ message: "Title, location, date, and elderId are required" });
    }

    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const LocalEvent = require("../models/localEvent");
    const organizer = family.name || family.username || "Family Member";
    const eventDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      eventDate.setHours(hours);
      eventDate.setMinutes(minutes);
    }

    const event = await LocalEvent.create({
      title,
      description,
      location,
      date: eventDate,
      time: time || "",
      type: type || "wellness",
      organizer,
    });

    await ActivityLog.create({
      elderId,
      activityType: "Other",
      description: `Event created: ${title}`,
      details: {
        location,
        time: time || "TBD",
      },
      relatedId: event._id,
    });

    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("Create family event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get messages for elder
exports.getMessages = async (req, res) => {
  try {
    const { elderId } = req.params;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await FamilyMessage.find({ elderId, familyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get elder details (profile)
exports.getElderDetails = async (req, res) => {
  try {
    const { elderId } = req.params;
    const familyId = req.user.id;

    // Verify family has access to this elder
    const family = await User.findById(familyId);
    if (!family.elderIds.includes(elderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const elder = await User.findById(elderId).select("-password");
    if (!elder) {
      return res.status(404).json({ message: "Elder not found" });
    }

    return res.status(200).json({
      success: true,
      elder: {
        _id: elder._id,
        name: elder.name,
        email: elder.email,
        username: elder.username,
        role: elder.role,
        createdAt: elder.createdAt,
      },
    });
  } catch (err) {
    console.error("Get elder details error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
