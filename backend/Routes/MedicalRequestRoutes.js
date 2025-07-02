const express = require("express");
const router = express.Router();
const { submitMRequest,getAllMRequests,updateMRequestStatus } = require("../Controllers/MedicalRequestController");


router.post("/submit", submitMRequest);
router.get("/allrequests", getAllMRequests);
router.put("/update/:requestId", updateMRequestStatus);

module.exports = router;
