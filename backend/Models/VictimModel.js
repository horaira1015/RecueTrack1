const mongoose = require("mongoose");

const VictimSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true }, // Ensure consistency with Camp model
  healthStatus: { type: String, enum: ["Stable", "Injured", "Critical"], required: true },
  familyMembers: { type: Number, required: true, min: 0 }, // Ensuring no negative values
  familyDetails: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      relationship: { type: String, required: true },
      healthStatus: { type: String, enum: ["Stable", "Injured", "Critical"], required: true }
    }
  ],
  specialNeeds: { type: String, default: "None" },
  registrationDate: { type: Date, default: Date.now }
});
// Automatically update the filled count in Camp when a victim is added
VictimSchema.post("save", async function (doc) {
  if (doc) {
    const camp = await mongoose.model("tbl_camp").findById(doc.campId);
    if (camp) {
      const newFilled = camp.filled + 1 + (doc.familyMembers || 0); // Ensure familyMembers is counted correctly
      await mongoose.model("tbl_camp").findByIdAndUpdate(doc.campId, { filled: newFilled });
    }
  }
});

// Automatically update the filled count when a victim is removed
VictimSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const camp = await mongoose.model("tbl_camp").findById(doc.campId);
    if (camp) {
      const newFilled = Math.max(0, camp.filled - (1 + (doc.familyMembers || 0))); // Prevent negative values
      await mongoose.model("tbl_camp").findByIdAndUpdate(doc.campId, { filled: newFilled });
    }
  }
});


const Victim = mongoose.model("tbl_victim", VictimSchema);
module.exports = Victim;
