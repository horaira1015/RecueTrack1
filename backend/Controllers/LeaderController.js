const Leader = require("../Models/Leader");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const CampOfficer = require("../Models/CofficerRegModel");
const MedicalOfficer = require("../Models/MofficerRegModel");
// Load environment variables
require("dotenv").config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Register Leader
exports.registerLeader = async (req, res) => {
  console.log("Register attempt:", req.body);
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password || !req.file) {
      return res.status(400).json({ message: "All fields are required!" });
    }



    // Check for duplicate email
    const existing = await Leader.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Leader already registered!" });
    }
    const existingOfficer = await MedicalOfficer.findOne({ email });
    if (existingOfficer) {
      return res.status(400).json({ message: "Medical Officer already registered!" });
    }

    const existingOfficer2 = await CampOfficer.findOne({ email });
    if (existingOfficer2) {
      return res.status(400).json({ message: "Camp Officer already registered!" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // For testing purposes, use plain text password
    const newLeader = new Leader({
          name,
          phone,
          email,
          password,
          idProof: req.file.path,
        });
    await newLeader.save();

    // Optional email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Leader Registration",
      text: `Hi ${name}, you've been registered as a Leader.`,
    });

    res.status(201).json({ message: "Leader registered successfully!", data: newLeader });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Login Leader without JWT
exports.loginLeader = async (req, res) => {
  try {
    console.log("Login attempt:", req.body.email);
    const { email, password } = req.body;

    const leader = await Leader.findOne({ email });
    if (!leader) {
      return res.status(404).json({ message: "Leader not found!" });
    }

    const isMatch = password === leader.password; // Plain text password check for testing
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // No JWT, just send success message and leader data
    res.status(200).json({
      success: true,
      message: "Login successful",
      leaderId: leader._id,
      name: leader.name,
      email: leader.email,
      phone: leader.phone,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};


// ✅ Get All Leaders
exports.getLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find().populate("assignedDisasters");
    res.status(200).json(leaders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaders", error });
  }
};

// ✅ Get Leader by ID
exports.getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id).populate("assignedDisasters");
    if (!leader) return res.status(404).json({ message: "Leader not found" });
    res.status(200).json(leader);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leader", error });
  }
};

// ✅ Update Leader
exports.updateLeader = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const updated = await Leader.findByIdAndUpdate(
      req.params.id,
      { name, phone, email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Leader not found" });
    res.status(200).json({ message: "Leader updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// ✅ Delete Leader
exports.deleteLeader = async (req, res) => {
  try {
    const deleted = await Leader.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Leader not found" });
    res.status(200).json({ message: "Leader deleted" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error });
  }
};
