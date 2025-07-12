const express = require("express");
const router = express.Router();
const {
  createCamp,
  getCamp,
  getCampsByDisasterId, 
  getCampById
} = require("../Controllers/CampRegController");

// POST /api/camps/cr
router.post("/cr", createCamp);

// GET /api/camps/cr
router.get("/cr", getCamp);

// GET /api/camps/disaster/:disasterId
router.get("/disaster/:disasterId", getCampsByDisasterId);

// GET /api/camps/get/:campId
router.get("/get/:campId", getCampById);

module.exports = router;
