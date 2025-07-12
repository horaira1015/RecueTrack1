const express = require("express");
const router = express.Router();
const disasterController = require("../Controllers/DisasterController");

router.post("/create", disasterController.createDisaster);
router.get("/getall", disasterController.getDisasters);
router.get("/leader/:leaderId", disasterController.getDisasterByLeaderId);


module.exports = router;
