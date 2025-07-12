const express = require("express");
const router = express.Router();
const {addCampStatus,getCampStatuses,getAllCampStatuses, getCampsByDisasterId} = require("../Controllers/CampStatusController");

router.post("/add", addCampStatus);
router.get("/get/:campId", getCampStatuses);
router.get("/getAll", getAllCampStatuses); // <-- NEW route for Admin
router.get("/disaster/:disasterId", getCampsByDisasterId);

module.exports = router;
