const nodemailer = require("nodemailer");
const CampOfficer = require("../Models/CofficerRegModel");
const MedicalOfficer = require("../Models/MofficerRegModel");
const Volunteer = require("../Models/VolunteerModel");
const CampAid = require("../Models/CampRegModel");
const Alert = require("../Models/AlertModel"); // Make sure the model exists and is correctly named

// Setup transporter (use your own email credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to get all user emails
const getAllUserEmails = async () => {
  const [campOfficers, medicalOfficers, volunteers] = await Promise.all([
    CampOfficer.find({}, "email"),
    MedicalOfficer.find({}, "email"),
    Volunteer.find({}, "email"),
  ]);
  return [...campOfficers, ...medicalOfficers, ...volunteers].map(user => user.email);
};

// Send Disaster Alert
exports.sendDisasterAlert = async (req, res) => {
  try {
    const { place, description } = req.body;
    const emails = await getAllUserEmails();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject: `New Disaster Alert - ${place}`,
      text: `A new disaster has been reported at ${place}.\n\nDescription:\n${description}`,
    };

    await transporter.sendMail(mailOptions);

    // Save alert to DB
    await Alert.create({
      type: "disaster",
      place,
      description,
      sentTo: emails,
    });

    res.json({ success: true, message: "Disaster alert sent and saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending disaster alert email." });
  }
};

// Send Out of Stock Alert
exports.sendOutOfStockAlert = async (req, res) => {
  try {
    const { campId, item, quantity } = req.body;
    const camp = await CampAid.findById(campId);
    const emails = await getAllUserEmails();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject: `Out of Stock Alert - ${item}`,
      text: `The item "${item}" is out of stock at camp "${camp.name}".\n\nRequired Quantity: ${quantity}`,
    };

    await transporter.sendMail(mailOptions);

    // Save alert to DB
    await Alert.create({
      type: "out_of_stock",
      camp: campId,
      item,
      quantity,
      sentTo: emails,
    });

    res.json({ success: true, message: "Out of stock alert sent and saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending out of stock alert email." });
  }
};
