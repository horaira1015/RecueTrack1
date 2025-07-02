const express = require("express");
const router = express.Router();
const {createIncident,getIncidentsByOfficer,getAllIncidents,updateIncidentByAdmin} = require("../Controllers/IncidentReportController");

router.post("/submit", createIncident);
router.get("/get/:officerId", getIncidentsByOfficer);
// Admin: View all incidents
router.get("/admin/all", getAllIncidents);

// Admin: Update an incident
router.put("/admin/update/:id", updateIncidentByAdmin);

module.exports = router;
