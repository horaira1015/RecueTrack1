const express = require("express");
const { getInventoryByCamp, updateInventoryStatus } = require("../Controllers/InventoryController");

const router = express.Router();

router.get("/getinventory/:campId", getInventoryByCamp);
router.put("items/:itemId", updateInventoryStatus);

module.exports = router;
