const CampStatus = require("../Models/CampStatusModel");
const mongoose = require("mongoose");

// Add a new camp status update
const addCampStatus = async (req, res) => {
    try {
      const { campId, officerId, report } = req.body;
  
      if (!campId || !officerId || !report.trim()) {
        return res.status(400).json({ error: "All fields (campId, officerId, report) are required." });
      }
  
      const newStatus = new CampStatus({
        campId,
        officerId,
        report,
        date: new Date(),
      });
  
      await newStatus.save();
      res.status(201).json({ message: "Status update added successfully", newStatus });
    } catch (error) {
      console.error("Error adding camp status:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };

  
// Get all status updates for a specific camp
const getCampStatuses = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!campId) {
      return res.status(400).json({ error: "⚠️ Camp ID is required" });
    }

    console.log(`[CampStatus] Fetching statuses for campId: ${campId}`);

    const statuses = await CampStatus.find({ campId })
      .populate("officerId", "name position") // You can add more fields as needed
      .sort({ date: -1 });

    if (!statuses.length) {
      return res.status(200).json({
        message: "ℹ️ No status updates found for this camp",
        count: 0,
        statuses: [],
      });
    }

    console.log(`[CampStatus] Found ${statuses.length} status updates`);

    return res.status(200).json({
      message: "✅ Camp status updates fetched successfully",
      count: statuses.length,
      statuses,
    });
  } catch (error) {
    console.error("[CampStatus] Error fetching camp statuses:", error);

    return res.status(500).json({
      error: "❌ Failed to fetch camp statuses",
      details: error.message,
    });
  }
};


    // Get all camp status reports (for admin)
const getAllCampStatuses = async (req, res) => {
  try {
    const statuses = await CampStatus.find()
      .populate("campId", "name place district")
      .populate("officerId", "name email")
      .sort({ date: -1 });

    if (!statuses.length) {
      return res.status(200).json({ message: "No camp status reports found", statuses: [] });
    }

    res.status(200).json({ total: statuses.length, statuses });
  } catch (error) {
    console.error("Error fetching all camp statuses:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getCampsByDisasterId = async (req, res) => {
  try {
    const camps = await Camp.find({ disaster: req.params.disasterId })
      .populate("campOfficer")
      .populate("medicalOfficer");
    res.status(200).json(camps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch camps" });
  }
};
module.exports={addCampStatus,getCampStatuses,getAllCampStatuses,getCampsByDisasterId}
