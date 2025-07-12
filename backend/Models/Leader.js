const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedDisasters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disaster" }],
});



module.exports = mongoose.model("Leader", leaderSchema);
