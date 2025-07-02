const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["disaster", "out_of_stock"],
    required: true,
  },
  place: String, // Only for disaster
  description: String, // Only for disaster
  campId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_camp",
  },
  item: String, // Only for out_of_stock
  quantity: Number, // Only for out_of_stock
  sentTo: [String], // Array of email addresses
  sentAt: {
    type: Date,
    default: Date.now,
  },
});
const Alert =mongoose.model("tbl_alert", alertSchema);
module.exports = Alert;
