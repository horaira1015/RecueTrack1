const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true }, // Ensure consistency with Camp model
    preferredTime: { type: String, required: true },
    registerDate: { type: Date, default: Date.now },
    skills: { type: String },
    status: { type: String, default: "pending" }, // pending, approved, rejected
      // Store hashed password
    
  });
  
  

const volunteer = mongoose.model("tbl_volunteer", VolunteerSchema);
module.exports = volunteer;
