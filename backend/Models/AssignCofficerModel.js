const mongoose = require("mongoose");

const AssignCofficerSchema = new mongoose.Schema({
  assignDate: { type: Date, required: true },
  campOfficerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tbl_camp_officers",  // Ensure this matches the model name exactly
    required: true 
  },
  campId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "tbl_camp", 
    required: true 
  }
});

const AssignCampOfficer = mongoose.model("tbl_assign_cofficer", AssignCofficerSchema);
module.exports = AssignCampOfficer;
