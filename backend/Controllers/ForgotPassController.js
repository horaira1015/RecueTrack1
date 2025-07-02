const CampOfficer = require("../Models/CofficerRegModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    console.log("Forgot password request received for email:", email);
    // Find the officer by email
    const officer = await CampOfficer.findOne({ email });
    console.log("Found officer:", officer);
    if (!officer) {
      return res.status(404).json({ success: false, message: "Camp Officer not found" });
    }

    // Since passwords are hashed, we can't retrieve the original one.
    // So, we’ll generate a temporary password and update it.

    const tempPassword = Math.random().toString(36).slice(-8); // e.g., 'a1b2c3d4'
    // const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const hashedPassword = tempPassword; // For testing purposes, use plain text password
    // Update the password in the DB
    officer.password = hashedPassword;
    await officer.save();

    // Send email with the new password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "CampAid - Password Reset",
      html: `
        <p>Hello ${officer.name},</p>
        <p>Your password has been reset.</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please log in and change your password immediately.</p>
        <br/>
        <p>– CampAid Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Temporary password sent to your email." });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
