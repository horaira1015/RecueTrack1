const MedicalOfficer = require("../Models/MofficerRegModel");
const CampOfficer = require("../Models/CofficerRegModel")
const AssignMedicalOfficer=require("../Models/AssignMofficerModel")
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// Load environment variables
require("dotenv").config();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage }).single("idProof");

// Configure Nodemailer for email sending
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Register Medical Officer with ID Proof Upload & Email Notification
exports.registerMedicalOfficer = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload failed", error: err });
        }

        try {
            const { name, email, phone, address, password, specialization } = req.body;
            const idProof = req.file ? req.file.path : null;

            // Validate input fields
            if (!name || !email || !phone || !address || !password || !idProof || !specialization) {
                return res.status(400).json({ message: "All fields including ID proof and specialization are required!" });
            }

            // Check if officer already exists
            const existingOfficer = await MedicalOfficer.findOne({ email });
            if (existingOfficer) {
                return res.status(400).json({ message: "Medical Officer already registered!" });
            }
             const existingOfficer2 = await CampOfficer.findOne({ email });
            if (existingOfficer2) {
                return res.status(400).json({ message: "Camp Officer already registered!" });
            }

            // Hash password before saving
            // const hashedPassword = await bcrypt.hash(password, 10);
            const hashedPassword = password; // For testing purposes, use plain text password

            // Save officer details in the database
            const newOfficer = new MedicalOfficer({ name, email, phone, address, password: hashedPassword, idProof, specialization });
            await newOfficer.save();

            // Send Registration Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Successful Registration as Medical Officer @ ReliefCamp",
                text: `Hello ${name},\n\nYou have been successfully registered as a Medical Officer at ReliefCamp.\n\nYour login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest Regards,\nReliefCamp Team`,
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({ message: "Medical Officer registered successfully & email sent!", data: newOfficer });

        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
};

exports.loginMedicalOfficer = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", email);

        const MOfficer = await MedicalOfficer.findOne({ email });
        if (!MOfficer) {
            return res.status(404).json({ success: false, message: "Medical Officer not found" });
        }

        // const isMatch = await bcrypt.compare(password, MOfficer.password);
        const isMatch = password === MOfficer.password; // For testing purposes, use plain text password
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        console.log("Medical Officer ID:", MOfficer._id);


        // ✅ Fetch campId from tbl_assign_mofficers
        const assignment = await AssignMedicalOfficer.findOne({ MOfficerId: MOfficer._id });

        
        if (!assignment) {
            return res.status(403).json({ success: false, message: "No camp assigned to this officer" });
        }

        const campId = assignment.campId;  // ✅ Retrieve assigned campId

        console.log("Login successful. Officer ID:", MOfficer._id, "Camp ID:", campId);

        res.json({ 
            success: true, 
            message: "Login successful", 
            MOfficerId: MOfficer._id,
            campId: campId  // ✅ Now campId is properly retrieved
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
};


// ✅ Get All Medical Officers
exports.getAllMedicalOfficers = async (req, res) => {
    try {
        const officers = await MedicalOfficer.find();
        res.status(200).json(officers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching medical officers", error });
    }
};

// ✅ Get a Single Medical Officer by ID
exports.getMedicalOfficerById = async (req, res) => {
    try {
        const officer = await MedicalOfficer.findById(req.params.id);
        if (!officer) return res.status(404).json({ message: "Medical Officer not found!" });

        res.status(200).json(officer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports. getMedicalOfficerCamp = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Fetching camp for Medical Officer ID:", id);
  
      const assignment = await AssignMedicalOfficer.findOne({ MOfficerId: id });
  
      if (!assignment) {
        return res.status(404).json({ message: "Camp not found for this Medical Officer" });
      }
  
      res.json({ campId: assignment.campId });
    } catch (error) {
      console.error("Error fetching medical officer camp:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

// ✅ Update Medical Officer by ID
exports.updateMedicalOfficer = async (req, res) => {
    try {
        const { name, phone, address, specialization } = req.body;

        const updatedOfficer = await MedicalOfficer.findByIdAndUpdate(
            req.params.id,
            { name, phone, address, specialization },
            { new: true }
        );

        if (!updatedOfficer) return res.status(404).json({ message: "Medical Officer not found!" });

        res.status(200).json({ message: "Medical Officer updated successfully!", updatedOfficer });

    } catch (error) {
        res.status(500).json({ message: "Error updating medical officer", error });
    }
};

// ✅ Delete Medical Officer by ID
exports.deleteMedicalOfficer = async (req, res) => {
    try {
        const deletedOfficer = await MedicalOfficer.findByIdAndDelete(req.params.id);

        if (!deletedOfficer) return res.status(404).json({ message: "Medical Officer not found!" });

        res.status(200).json({ message: "Medical Officer deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting medical officer", error });
    }
};
