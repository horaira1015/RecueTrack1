const Disaster = require("../Models/Disaster");
const Leader = require("../Models/Leader");

// Create a disaster and assign a leader
exports.createDisaster = async (req, res) => {
  try {
    const { name, location, description, leaderId } = req.body;

    const leader = await Leader.findById(leaderId);
    if (!leader) return res.status(404).json({ message: "Leader not found" });

    const disaster = new Disaster({ name, location, description, leader: leaderId });
    await disaster.save();

    leader.assignedDisasters.push(disaster._id);
    await leader.save();

    res.status(201).json(disaster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all disasters with leader info
exports.getDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find().populate("leader");
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDisasterByLeaderId = async (req, res) => {
  try {
    console.log("Fetching disaster for leader:", req.params.leaderId);
    const disaster = await Disaster.findOne({ leader: req.params.leaderId }).populate("leader");
    if (!disaster) return res.status(404).json({ message: "No disaster assigned" });
    res.status(200).json(disaster);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};