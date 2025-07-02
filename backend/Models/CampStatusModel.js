const mongoose = require("mongoose");

const CampStatusSchema = new mongoose.Schema({
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp_officers", required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
  report: { type: String, required: true },
  date: { type: Date, default: Date.now }
});


const CampStatus = mongoose.model("tbl_camp_status", CampStatusSchema);
module.exports = CampStatus;