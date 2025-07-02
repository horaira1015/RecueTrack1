const express = require("express");
const {
    registerCampOfficer,
    loginCampOfficer,
    getAllCampOfficers,
    updateCampOfficer,
    deleteCampOfficer,
    
    sendEmail,
    
} = require("../Controllers/CofficerRegController");

const router = express.Router();

// CRUD Operations
router.post("/createoffReg", registerCampOfficer);
router.post("/login", loginCampOfficer );
router.get("/get", getAllCampOfficers);
// router.get("/update/:id", getCampOfficerById);
router.put("/update/:id", updateCampOfficer);
router.delete("/delete/:id", deleteCampOfficer);
router.post("/email", sendEmail );

// router.put("/assigncofficer/:officerId", assignCampOfficer)
  

module.exports = router;