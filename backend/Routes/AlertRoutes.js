const express = require("express");
const router = express.Router();
const {sendDisasterAlert,sendOutOfStockAlert} = require("../Controllers/AlertController");

router.post("/disaster", sendDisasterAlert);
router.post("/out-of-stock", sendOutOfStockAlert);

module.exports = router;
