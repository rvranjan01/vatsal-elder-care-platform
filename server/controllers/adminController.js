const User = require("../models/user");
const { sendProviderActivationEmail } = require("../services/emailService");


exports.getPendingProviders = async (req, res) => {
  try {
    const providerRoles = ["doctor", "companion", "nurse"];
    const providers = await User.find({ role: { $in: providerRoles }, isActive: false }).select('-password');
    res.status(200).json({ providers });  // ← CHANGED "pending" → "providers"
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getActiveProviders = async (req, res) => {
  try {
    const providerRoles = ["doctor", "companion", "nurse"];
    const { role } = req.query;
    let query = { isActive: true, role: { $in: providerRoles } };
    if (role && providerRoles.includes(role)) query.role = role;
    
    const providers = await User.find(query).select('-password');  // ← "providers"
    res.status(200).json({ providers });  // ← CHANGED "active" → "providers"
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Activate provider account (admin only)
exports.activateProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const providerRoles = ["doctor", "companion", "nurse"];
    if (!providerRoles.includes(provider.role)) {
      return res.status(400).json({ message: "User is not a provider" });
    }

    if (provider.isActive) {
      return res.status(400).json({ message: "Provider already activated" });
    }

    provider.isActive = true;
    await provider.save();

    // Send activation email
    await sendProviderActivationEmail(provider.email, provider.name);

    // Emit socket event for provider activation
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('providerActivated', {
          providerId: provider._id,
          name: provider.name,
          email: provider.email,
          role: provider.role,
          specialty: provider.specialty || null
        });
      }
    } catch (e) {
      console.error('Socket emit error (providerActivated):', e);
    }

    res.status(200).json({
      message: "Provider activated successfully",
      provider: { id: provider._id, name: provider.name, email: provider.email, role: provider.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate provider account
exports.deactivateProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isActive = false;
    await provider.save();

    res.status(200).json({
      message: "Provider deactivated successfully",
      provider: { id: provider._id, name: provider.name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSignupsByRole = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    
    const signups = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ signups });  // ← CHANGED "users" → "signups"
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
