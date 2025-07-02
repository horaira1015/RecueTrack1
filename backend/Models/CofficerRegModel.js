const mongoose = require("mongoose");

const campOfficerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }, // Encrypted password
    idProof: { type: String, required: true }, // Stores file path of uploaded ID proof
}, { timestamps: true });

const CampOfficer = mongoose.model("tbl_camp_officers", campOfficerSchema);
module.exports = CampOfficer;