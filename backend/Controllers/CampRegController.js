const Camp = require("../Models/CampRegModel");

// Create new camp under a disaster
const createCamp = async (req, res) => {
  try {
    const { name, place, district, totalCapacity, disaster } = req.body;

    if (!name || !place || !district || !totalCapacity || !disaster) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Camp.findOne({ name, place, district, disaster });
    if (existing) {
      return res.status(409).json({ error: "Camp with these details already exists." });
    }

    const newCamp = await Camp.create({
      name,
      place,
      district,
      totalCapacity,
      disaster,
      status: "Inactive",
    });

    res.status(201).json({ message: "Camp created successfully", camp: newCamp });
  } catch (error) {
    console.error("Create Camp Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all camps with virtuals
const getCamp = async (req, res) => {
  try {
    const camps = await Camp.find().populate("campOfficer").populate("medicalOfficer");
    const withVirtuals = camps.map((camp) => camp.toObject({ virtuals: true }));
    res.status(200).json(withVirtuals);
  } catch (error) {
    console.error("Fetch Camp Error:", error);
    res.status(500).json({ error: "Error fetching camps" });
  }
};

// Get a specific camp by ID (with populated officers and virtuals)
const getCampById = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!campId) {
      return res.status(400).json({ error: "Camp ID is required" });
    }

    const camp = await Camp.findById(campId)
      .populate("campOfficer", "name position")
      .populate("medicalOfficer", "name position");

    if (!camp) {
      return res.status(404).json({ error: "Camp not found" });
    }

    res.status(200).json(camp.toObject({ virtuals: true }));
  } catch (error) {
    console.error("Error fetching camp by ID:", error);
    res.status(500).json({ error: "Failed to fetch camp", details: error.message });
  }
};


// Get camps by disaster ID (used by leader dashboard)
const getCampsByDisasterId = async (req, res) => {
  try {
    const { disasterId } = req.params;
    const camps = await Camp.find({ disaster: disasterId })
      .populate("campOfficer")
      .populate("medicalOfficer");

    const withVirtuals = camps.map((camp) => camp.toObject({ virtuals: true }));
    res.status(200).json(withVirtuals);
  } catch (error) {
    console.error("Fetch by Disaster Error:", error);
    res.status(500).json({ error: "Failed to fetch camps" });
  }
};

module.exports = { createCamp, getCamp, getCampsByDisasterId, getCampById };
