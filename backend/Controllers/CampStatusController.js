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
          return res.status(400).json({ error: "Camp ID is required" });
        }
    
        const statuses = await CampStatus.find({ campId }).sort({ date: -1 });
    
        if (!statuses.length) {
          return res.status(404).json({ message: "No status updates found for this camp" });
        }
    
        res.status(200).json(statuses);
      } catch (error) {
        console.error("Error fetching camp statuses:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    };
    // Get all camp status reports (for admin)
const getAllCampStatuses = async (req, res) => {
  try {
    
    const statuses = await CampStatus.find()
      .populate("campId", "name") // populates only the 'name' field from Camp collection
      .populate("officerId", "name") // populates only the 'name' field from Officer collection
      .sort({ date: -1 });

    if (!statuses.length) {
      return res.status(404).json({ message: "No camp status reports found" });
    }

    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching all camp statuses:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
module.exports={addCampStatus,getCampStatuses,getAllCampStatuses}
