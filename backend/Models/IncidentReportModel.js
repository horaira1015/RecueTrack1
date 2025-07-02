const mongoose = require("mongoose");

const incidentReportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp_officers", required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  adminResponse: {
    type: String,
    default: "",
  }
}, {
  timestamps: true
});


const IncidentReport = mongoose.model("tbl_incidentReport", incidentReportSchema);

module.exports = IncidentReport;