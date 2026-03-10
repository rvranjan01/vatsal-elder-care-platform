const nodemailer = require("nodemailer");

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password"
  }
});

// Send provider activation notification
exports.sendProviderActivationEmail = async (providerEmail, providerName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@vatsal.local",
      to: providerEmail,
      subject: "Your Account Has Been Activated - Vatsal",
      html: `
        <h2>Welcome to Vatsal, ${providerName}!</h2>
        <p>Your account has been verified and activated by our admin team.</p>
        <p>You can now log in at: <strong>https://vatsal.local/login</strong></p>
        <p>Your profile is now visible to families and elders in the system.</p>
        <p>Thank you for joining Vatsal!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Activation email sent to ${providerEmail}`);
  } catch (error) {
    console.error(`Error sending activation email to ${providerEmail}:`, error.message);
  }
};

// Send booking confirmation request to provider
exports.sendBookingConfirmationEmail = async (providerEmail, providerName, elderName, appointmentDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@vatsal.local",
      to: providerEmail,
      subject: "New Booking Request - Action Required",
      html: `
        <h3>New Booking Request</h3>
        <p>Dear ${providerName},</p>
        <p>You have a new booking request:</p>
        <ul>
          <li><strong>Elder:</strong> ${elderName}</li>
          <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleString()}</li>
        </ul>
        <p>Please log in to your dashboard to confirm or reject this booking.</p>
        <p><a href="https://vatsal.local/dashboard">View Dashboard</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Booking confirmation request sent to ${providerEmail}`);
  } catch (error) {
    console.error(`Error sending booking email to ${providerEmail}:`, error.message);
  }
};

// Send booking confirmation to family
exports.sendBookingConfirmedEmail = async (familyEmail, familyName, elderName, appointmentDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@vatsal.local",
      to: familyEmail,
      subject: "Booking Confirmed - Vatsal",
      html: `
        <h3>Your Booking is Confirmed!</h3>
        <p>Dear ${familyName},</p>
        <p>Your booking for <strong>${elderName}</strong> has been confirmed:</p>
        <ul>
          <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleString()}</li>
        </ul>
        <p>You can view details in your dashboard.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Booking confirmation sent to ${familyEmail}`);
  } catch (error) {
    console.error(`Error sending confirmation email to ${familyEmail}:`, error.message);
  }
};

// Send rejection notification
exports.sendBookingRejectedEmail = async (familyEmail, familyName, elderName, reason = "") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@vatsal.local",
      to: familyEmail,
      subject: "Booking Rejection - Vatsal",
      html: `
        <h3>Booking Request Status Update</h3>
        <p>Dear ${familyName},</p>
        <p>Unfortunately, your booking request for <strong>${elderName}</strong> has been declined.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>Please try booking another time or contact support.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Rejection notification sent to ${familyEmail}`);
  } catch (error) {
    console.error(`Error sending rejection email to ${familyEmail}:`, error.message);
  }
};
