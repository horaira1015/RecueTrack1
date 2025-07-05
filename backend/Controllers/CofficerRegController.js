const CampOfficer = require("../Models/CofficerRegModel");
const MedicalOfficer = require("../Models/MofficerRegModel")
const CampAid =require("../Models/CampRegModel")
const AssignCampOfficer=require("../Models/AssignCofficerModel")
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

// ✅ Register Camp Officer with ID Proof Upload & Email Notification
exports.registerCampOfficer = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload failed", error: err });
        }

        try {
            const { name, email, phone, address, password } = req.body;
            const idProof = req.file ? req.file.path : null;

            // Validate input fields
            if (!name || !email || !phone || !address || !password || !idProof) {
                return res.status(400).json({ message: "All fields including ID proof are required!" });
            }

            // Check if officer already exists
            const existingOfficer = await CampOfficer.findOne({ email });
            if (existingOfficer) {
                return res.status(400).json({ message: "Camp Officer already registered!" });
            }
            // Check if officer already exists
            const existingOfficer2 = await MedicalOfficer.findOne({ email });
            if (existingOfficer2) {
                return res.status(400).json({ message: "Medical Officer already registered!" });
            }

            // Hash password before saving
            // const hashedPassword = await bcrypt.hash(password, 10);
            const hashedPassword = password; // For testing purposes, use plain text password
            // Save officer details in the database
            const newOfficer = new CampOfficer({ name, email, phone, address, password: hashedPassword, idProof });
            await newOfficer.save();

            // Send Registration Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Successful Registration as Camp Officer @ CampAid",
                text: `Hello ${name},\n\nYou have been successfully registered as a Camp Officer at @Home.\n\nYour login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest Regards,\n@CampAid Team`,
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({ message: "Camp Officer registered successfully & email sent!", data: newOfficer });

        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
};

// const AssignCampOfficer = require("../Models/AssignCampOfficerModel"); // Import the model

exports.loginCampOfficer = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", email);

        const campOfficer = await CampOfficer.findOne({ email });
        console.log("Found Cam----------p Officer:", campOfficer);
        if (!campOfficer) {
            return res.status(404).json({ success: false, message: "Camp Officer not found" });
        }
        console.log("Camp Officer found:", campOfficer._id);

        // const isMatch = await bcrypt.compare(password, campOfficer.password);
        const isMatch = (password === campOfficer.password); // For testing purposes, use plain text password comparison
        console.log("Password comparison result:", password, campOfficer.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // ✅ Fetch campId from tbl_assign_cofficers
        const assignment = await AssignCampOfficer.findOne({ campOfficerId: campOfficer._id });
        console.log("Assignment found:", assignment);
        if (!assignment) {
            return res.status(403).json({ success: false, message: "No camp assigned to this officer" });
        }

        const campId = assignment.campid;  // ✅ Retrieve assigned campId

        console.log("Login successful. Officer ID:", campOfficer._id, "Camp ID:", campId);

        res.json({ 
            success: true, 
            message: "Login successful", 
            campOfficerId: campOfficer._id,
            campId: campId  // ✅ Now campId is properly retrieved
        });
        

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
};




// ✅ Get All Camp Officers
exports.getAllCampOfficers = async (req, res) => {
    try {
        const officers = await CampOfficer.find();
        res.status(200).json(officers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching camp officers", error });
    }
};

// ✅ Get a Single Camp Officer by ID
exports.getCampOfficerById = async (req, res) => {
    try {
        const officer = await CampOfficer.findById(req.params.id);
        if (!officer) return res.status(404).json({ message: "Camp Officer not found!" });

        res.status(200).json(officer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update Camp Officer by ID
exports.updateCampOfficer = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const updatedOfficer = await CampOfficer.findByIdAndUpdate(
            req.params.id,
            { name, phone, address },
            { new: true }
        );

        if (!updatedOfficer) return res.status(404).json({ message: "Camp Officer not found!" });

        res.status(200).json({ message: "Camp Officer updated successfully!", updatedOfficer });

    } catch (error) {
        res.status(500).json({ message: "Error updating camp officer", error });
    }
};

// ✅ Delete Camp Officer by ID
exports.deleteCampOfficer = async (req, res) => {
    try {
        const deletedOfficer = await CampOfficer.findByIdAndDelete(req.params.id);

        if (!deletedOfficer) return res.status(404).json({ message: "Camp Officer not found!" });

        res.status(200).json({ message: "Camp Officer deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting camp officer", error });
    }
};

// exports.assignCampOfficer = async (req, res) => {
//     try {
//         const { campId } = req.body;
//         const officer = await CampOfficer.findByIdAndUpdate(
//             req.params.officerId,
//             { assignedCamp: campId },
//             { new: true }
//         );

//         if (!officer) return res.status(404).json({ message: "Officer not found" });

//         res.json({ message: "Officer assigned successfully", officer });
//     } catch (error) {
//         res.status(500).json({ message: "Error assigning officer to camp" });
//     }
// };

exports.sendEmail = async (req, res) => {
    const { email, pdfData } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Donation Receipt",
        text: "Thank you for your donation. Please find your donation receipt attached.",
        attachments: [
            {
                filename: "donation_receipt.pdf",
                content: pdfData,
                encoding: "base64",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email", error: error.message });
    }
};