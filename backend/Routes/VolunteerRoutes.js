const express = require("express");
const router = express.Router();
const { registerVolunteer, 
    getVolunteers,
    getPendingVolunteers, 
    approveVolunteer, 
    getVolunteerDetails,
    getApprovedVolunteers,
    rejectVolunteer,
    volunteerLogin ,getApprovedVolunteersByCamp} = require("../Controllers/VolunteerController");

router.post("/register", registerVolunteer);
router.get("/volunteers", getVolunteers);
router.post("/login", volunteerLogin); // Changed from GET to POST
router.get("/pending", getPendingVolunteers);
router.post("/approve/:id", approveVolunteer);
router.post("/reject/:id", rejectVolunteer);
router.get("/approved", getApprovedVolunteers); // ✅ New route to fetch approved volunteers
router.get("get/:id", getVolunteerDetails);
router.get("/approvedVolunteers/:campId", getApprovedVolunteersByCamp);

module.exports = router;
