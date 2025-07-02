const express = require("express");
const router = express.Router();
const {getMedicalReportsByOfficer,getMedicalReportsByVictim,addMedicalReport,getAllMedicalReports} = require("../Controllers/MedicalReportController");

// ➤ Route to add a medical report
router.post("/add", addMedicalReport);

// ➤ Route to get all medical reports for a specific medical officer
router.get("/get/:officerId", getMedicalReportsByOfficer);

// ➤ Route to get all medical reports for a specific victim
router.get("/victim/:victimId", getMedicalReportsByVictim);
router.get("/getreports", getAllMedicalReports);

module.exports = router;
