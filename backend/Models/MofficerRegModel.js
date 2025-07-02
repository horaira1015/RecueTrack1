const mongoose = require("mongoose");

const medicalOfficerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }, // Encrypted password
    idProof: { type: String, required: true }, // Stores file path of uploaded ID proof
    specialization: { type: String, required: true }, // Medical specialization
}, { timestamps: true });

const MedicalOfficer = mongoose.model("tbl_medical_officers", medicalOfficerSchema);
module.exports = MedicalOfficer;
