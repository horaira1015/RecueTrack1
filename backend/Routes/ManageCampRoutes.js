const express = require("express");
const router = express.Router();
const { createCamp, getCamps, updateCamp, deleteCamp } = require("../Controllers/ManageCampController");

// Routes
router.post("/createCamp", createCamp);
router.get("/getCamp", getCamps);
router.put("/updateCamp/:id", updateCamp);
router.delete("/deleteCamp/:id", deleteCamp);

module.exports = router;
