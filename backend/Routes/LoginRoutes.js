const express = require("express");
const router = express.Router();

const { loginCampOfficer } = require("../Controllers/CofficerRegController");
const { loginMedicalOfficer } = require("../Controllers/MofficerRegController");

// Authentication Routes
router.post("/campofficer", loginCampOfficer);
router.post("/medicalofficer", loginMedicalOfficer);

module.exports = router;
