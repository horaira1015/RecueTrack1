const mongoose = require("mongoose");

const CampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  district: { type: String, required: true },
  totalCapacity: { type: Number, required: true },
  filled: { type: Number, default: 0 },
  disaster: { type: mongoose.Schema.Types.ObjectId, ref: "disaster" }, // 💥 New
  campOfficer: [{ type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp_officers" }],
  medicalOfficer: [{ type: mongoose.Schema.Types.ObjectId, ref: "tbl_medical_officers" }],

  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

// Virtual for available space
CampSchema.virtual("availableSpace").get(function () {
  return this.totalCapacity - this.filled;
});

CampSchema.set("toJSON", { virtuals: true });
CampSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("tbl_camp", CampSchema);
