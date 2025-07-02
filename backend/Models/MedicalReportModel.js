const mongoose = require("mongoose");

const MedicalReportSchema = new mongoose.Schema({
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_victim", required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_medical_officers", required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  medications: { type: String, required: true },
  followUpDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now }
});

const MedicalReport = mongoose.model("tbl_medical_report", MedicalReportSchema);
module.exports = MedicalReport;
