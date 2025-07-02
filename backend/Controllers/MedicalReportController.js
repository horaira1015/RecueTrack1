const MedicalReport = require("../Models/MedicalReportModel");

// ➤ Controller to add a medical report
exports.addMedicalReport = async (req, res) => {
  try {
    const { victimId, officerId, diagnosis, treatment, medications, followUpDate } = req.body;

    if (!victimId || !officerId || !diagnosis || !treatment || !medications) {
      return res.status(400).json({ message: "All fields except follow-up date are required." });
    }
    console.log("Received data:", req.body);
    const reports = await MedicalReport.find({ officerId }).populate("victimId");
res.json(reports);


    const newReport = new MedicalReport({
      victimId,
      officerId,
      diagnosis,
      treatment,
      medications,
      followUpDate,
    });

    await newReport.save();
    res.status(201).json({ message: "Medical report added successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ message: "Error adding medical report", error: error.message });
  }
};

// ➤ Controller to get all medical reports by a medical officer
exports.getMedicalReportsByOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const reports = await MedicalReport.find({ officerId }).populate("victimId", "name age healthStatus");
    
    if (!reports.length) {
      return res.status(404).json({ message: "No medical reports found for this officer." });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// ➤ Controller to get all medical reports for a specific victim
exports.getMedicalReportsByVictim = async (req, res) => {
  try {
    const { victimId } = req.params;
    const reports = await MedicalReport.find({ victimId }).populate("officerId", "name");

    if (!reports.length) {
      return res.status(404).json({ message: "No medical reports found for this victim." });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};
// ➤ Controller to get ALL medical reports (for admin view or complete export)
exports.getAllMedicalReports = async (req, res) => {
  try {
    console.log("Fetching all medical reports...");
    const reports = await MedicalReport.find()
      .populate("victimId", "name age gender healthStatus familyMembers")
      .populate("officerId", "name email");

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getAllMedicalReports:", error);
    res.status(500).json({ message: "Error fetching all medical reports", error: error.message });
  }
};
