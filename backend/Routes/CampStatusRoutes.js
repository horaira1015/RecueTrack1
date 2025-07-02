const express = require("express");
const router = express.Router();
const {addCampStatus,getCampStatuses,getAllCampStatuses} = require("../Controllers/CampStatusController");

router.post("/add", addCampStatus);
router.get("/get/:campId", getCampStatuses);
router.get("/getAll", getAllCampStatuses); // <-- NEW route for Admin

module.exports = router;
