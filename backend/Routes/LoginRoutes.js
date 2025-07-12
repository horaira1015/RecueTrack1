const express = require("express");
const router = express.Router();

const { loginCampOfficer } = require("../Controllers/CofficerRegController");
const { loginMedicalOfficer } = require("../Controllers/MofficerRegController");
const { loginLeader } = require("../Controllers/LeaderController");

// Authentication Routes
router.post("/campofficer", loginCampOfficer);
router.post("/medicalofficer", loginMedicalOfficer);
router.post("/leader", loginLeader);

module.exports = router;
