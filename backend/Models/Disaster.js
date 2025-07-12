const mongoose = require("mongoose");

const disasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "Leader" },
});

module.exports = mongoose.model("Disaster", disasterSchema);
