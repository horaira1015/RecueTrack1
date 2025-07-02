const express = require("express");
const router = express.Router();
const { assignCampOfficer, getAllAssignedCampOfficers,getAssignedCampForOfficer } = require("../Controllers/AssigncofficerController");

// Route to assign a camp officer
router.put("/assign/:officerId", assignCampOfficer);

// Route to fetch assigned officers
router.get("/getAssignedCamp/:officerId", getAssignedCampForOfficer);
router.get("/getAssignedOfficers", getAllAssignedCampOfficers);
 
module.exports = router;
