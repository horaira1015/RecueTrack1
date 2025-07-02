const IncidentReport = require("../Models/IncidentReportModel");

// Submit incident
const createIncident = async (req, res) => {
    try {
      console.log("Incoming data:", req.body); // Add this line
      const report = await IncidentReport.create(req.body);
      res.status(201).json(report);
    } catch (error) {
      console.error("Create incident error:", error);
      res.status(500).json({ error: "Failed to create incident" });
    }
  };
  

// Get incidents by officer
const getIncidentsByOfficer = async (req, res) => {
  try {
    const reports = await IncidentReport.find({ officerId: req.params.officerId }).sort({ incidentDate: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Fetch incident error:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};
// ✅ NEW: Get all incidents (for Admin)
const getAllIncidents = async (req, res) => {
    try {
      const reports = await IncidentReport.find()
        .populate("officerId", "name ") // Optional: include officer details
        .populate("campId", "name")      // Optional: include camp name
        .sort({ createdAt: -1 });
  
      res.json(reports);
    } catch (error) {
      console.error("Admin fetch error:", error);
      res.status(500).json({ error: "Failed to fetch incidents for admin" });
    }
  };
  
  // ✅ NEW: Admin updating incident (status + response)
  const updateIncidentByAdmin = async (req, res) => {
    const { status, adminResponse } = req.body;
  
    try {
      const updated = await IncidentReport.findByIdAndUpdate(
        req.params.id,
        { status, adminResponse },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: "Incident not found" });
      }
  
      res.json(updated);
    } catch (error) {
      console.error("Update incident error:", error);
      res.status(500).json({ error: "Failed to update incident" });
    }
  };
module.exports={createIncident,getIncidentsByOfficer,getAllIncidents,updateIncidentByAdmin};