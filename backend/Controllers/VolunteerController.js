const Volunteer = require("../Models/VolunteerModel");
const CampAid = require("../Models/CampRegModel"); // Ensure correct import
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


// Load environment variables
require("dotenv").config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const registerVolunteer = async (req, res) => {
  try {
    const { name, email, phone, address, password,campId, availableTime, skills } = req.body;

    const camp = await CampAid.findById(campId);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // For testing purposes, use plain text password

    const newVolunteer = new Volunteer({
        name,
        email,
        phone,
        address,
        password:hashedPassword,
        campId: camp._id, // Fix: Store only _id
        preferredTime: availableTime,
        skills,
        
    });

    console.log("Received data:", req.body);

    
    await newVolunteer.save();

    


    // Send Registration Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Volunteer approved- Login now",
      text: `Hello ${name},\n\nYour account has been approved.\n\nThank you for stepping forward to support those in need. Your contribution will make a meaningful difference in disaster relief efforts.

      \n\nYour login details:\nEmail: ${email}\nPassword: ${password}\nClick here to login : http://localhost:3000/VolunteerLogin\n\nLooking forward to working together for a better tomorrow!\n\nBest Regards,\n@CampAid Team`,
  };

  await transporter.sendMail(mailOptions);


    res.status(201).json({ message: "Volunteer registered successfully" });

  } catch (error) {
    console.error("Error registering volunteer:", error); // Log error
    res.status(500).json({ error: error.message });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate("campId"); // Optional: Populate camp details
    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error); // Log error
    res.status(500).json({ error: error.message });
  }
};

const getVolunteerDetails = async (req, res) => {
  try {
      // const { id } = req.params; // Get ID from URL
      const volunteer = await Volunteer.findById(id).select(req.params.id);
      if (!volunteer) {
          return res.status(404).json({ message: "Volunteer not found" });
      }
      res.json(volunteer);
  } catch (error) {
      console.error("Error fetching volunteer details:", error);
      res.status(500).json({ error: "Server error" });
  }
};



// Get all volunteers pending approval for a specific camp
const getPendingVolunteers = async (req, res) => {
  try {
    const pendingVolunteers = await Volunteer.find({ status: "pending" });
    res.status(200).json(pendingVolunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve a volunteer
const approveVolunteer = async (req, res) => {
  try {
      const { id } = req.params;
      const volunteer = await Volunteer.findById(id);
      if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

      volunteer.status = "approved"; // Update status
      await volunteer.save();
      
      res.status(200).json({ message: "Volunteer approved successfully" });
  } catch (error) {
      console.error("Error approving volunteer:", error);
      res.status(500).json({ message: "Server error" });
  }
};
// Get all approved volunteers
const getApprovedVolunteers = async (req, res) => {
  try {
    
    const approvedVolunteers = await Volunteer.find({ status: "approved" }).populate("campId");
    res.status(200).json(approvedVolunteers);
  } catch (error) {
    console.error("Error fetching approved volunteers:", error);
    res.status(500).json({ error: error.message });
  }
};



// Reject a volunteer
const rejectVolunteer = async (req, res) => {
  try {
      const { id } = req.params;
      const volunteer = await Volunteer.findById(id);
      if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

      volunteer.status = "rejected"; // Update status
      await volunteer.save();
      
      res.status(200).json({ message: "Volunteer rejected successfully" });
  } catch (error) {
      console.error("Error rejecting volunteer:", error);
      res.status(500).json({ message: "Server error" });
  }
};


const volunteerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email, status: "approved" });
    if (!volunteer) return res.status(401).json({ message: "Invalid email or not approved" });

    // const isMatch = await bcrypt.compare(password, volunteer.password);
    const isMatch = (password === volunteer.password); // For testing purposes, use plain text password comparison
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: volunteer._id }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApprovedVolunteersByCamp = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!campId) {
      return res.status(400).json({ error: "Camp ID is required" });
    }

    console.log("Received campId:", campId); // Debugging

    const approvedVolunteersCount = await Volunteer.countDocuments({ campId, status: "approved" });

    res.status(200).json({ count: approvedVolunteersCount });
  } catch (error) {
    console.error("Error fetching approved volunteers count:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerVolunteer, getVolunteers ,getVolunteerDetails,getPendingVolunteers, approveVolunteer,getApprovedVolunteers, rejectVolunteer,volunteerLogin,getApprovedVolunteersByCamp};
