const mongoose = require("mongoose");

const AssignMofficerSchema = new mongoose.Schema({
  assignDate: { type: Date, required: true },
  MOfficerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tbl_medical_officers",  // Ensure this matches the model name exactly
    required: true 
  },
  campId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tbl_camp", 
    required: true 
  }
});

const AssignMedicalOfficer = mongoose.model("tbl_assign_mofficer", AssignMofficerSchema);
module.exports = AssignMedicalOfficer;
