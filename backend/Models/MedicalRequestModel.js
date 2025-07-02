const mongoose = require("mongoose");

const MedicalRequestSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_items", required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
  mOfficerId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_medical_officers", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  rejectionReason: { type: String, default: "" }, // New field
  requestDate: { type: Date, default: Date.now }
});

const MedicalRequest = mongoose.model("tbl_medical_requests", MedicalRequestSchema);
module.exports = MedicalRequest;
