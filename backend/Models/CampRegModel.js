const mongoose = require("mongoose");

const CampSchema = new mongoose.Schema({
    name: { type: String, required: true },
    place: { type: String, required: true },
    district: { type: String, required: true },
    totalCapacity: { type: Number, required: true },
    filled: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  });
  
  // Virtual property for available space
  CampSchema.virtual("availableSpace").get(function () {
    return this.totalCapacity - this.filled;
  });
  
  // Ensure virtuals are included in API responses
  CampSchema.set("toJSON", { virtuals: true });
  CampSchema.set("toObject", { virtuals: true });

const CampAid = mongoose.model("tbl_camp", CampSchema);
module.exports = CampAid;
