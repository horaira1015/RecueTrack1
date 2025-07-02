const mongoose = require("mongoose");

const SupplyRequestSchema = new mongoose.Schema({
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp_officers", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_items", required: true },
  quantityRequested: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  rejectionReason: { type: String, default: "" }, // New field

  requestDate: { type: Date, default: Date.now },
});

const SupplyRequest = mongoose.model("tbl_supply_requests", SupplyRequestSchema);
module.exports = SupplyRequest;
