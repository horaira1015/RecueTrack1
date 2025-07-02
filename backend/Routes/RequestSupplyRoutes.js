const express = require("express");
const router = express.Router();
const { submitRequest, getAllRequests, updateRequestStatus } = require("../Controllers/RequestSupplyController");

router.post("/request", submitRequest);
router.get("/requests", getAllRequests);
router.put("/request/:requestId", updateRequestStatus);

module.exports = router;
