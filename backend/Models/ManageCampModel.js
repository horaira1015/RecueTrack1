const mongoose = require("mongoose");

const CampSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    place: { type: String, required: true },
    pincode: { type: String, required: true },
    totalCapacity: { type: Number, required: true },
    status: { type: String, enum: ["Inactive", "Active"], default: "Inactive" }
});

// Check if model already exists before defining it again
const CampModel = mongoose.models.tbl_camp || mongoose.model("tbl_camp", CampSchema);

module.exports = CampModel;
