const express = require("express");
const {
    registerMedicalOfficer,
    getAllMedicalOfficers,
    updateMedicalOfficer,
    deleteMedicalOfficer,
    getMedicalOfficerCamp
} = require("../Controllers/MofficerRegController");

const router = express.Router();

// CRUD Operations
router.post("/register", registerMedicalOfficer);
router.get("/get", getAllMedicalOfficers);
router.put("/update/:id", updateMedicalOfficer);
router.get("/:id/camp", getMedicalOfficerCamp);

router.delete("/delete/:id", deleteMedicalOfficer);

module.exports = router;
