 const express = require("express");
 const router = express.Router();
 const { assignMedicalOfficer,getAllAssignedMedicalOfficers, getAssignedMedicalForOfficer } = require("../Controllers/AssignmofficerController");
 
 // Route to assign a camp officer
 router.put("/assign/:officerId", assignMedicalOfficer);
 
 // Route to fetch assigned officers
 router.get("/getAssignedCamp/:MOfficerId", getAssignedMedicalForOfficer);
 router.get("/getAssignedOfficers", getAllAssignedMedicalOfficers);
 module.exports = router;
 