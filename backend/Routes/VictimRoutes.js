const express = require("express");
const router = express.Router();
const {registerVictim,getVictims ,getAllVictimsWithCampDetails,getVictimById,updateVictim,deleteVictim,getVictimsByCamp,getVictimStatsByCamp,getHealthStatusCounts,updateFamilyMemberHealthStatus} = require("../Controllers/VictimController");

router.post("/register", registerVictim);
router.get("/getVictims", getVictims);
router.get("/get/:id", getVictimById);
router.put("/update/:id",updateVictim);
router.delete("/delete/:id",deleteVictim);
router.get("/getbycamp/:officerId", getVictimsByCamp); // ✅ Use `router`
router.get("/stats/:officerId", getVictimStatsByCamp);
// routes/victimRoutes.js
router.get("/healthStatusCounts/:campId", getHealthStatusCounts);
router.put("/updateFamilyMember/:memberId", updateFamilyMemberHealthStatus);
router.get("/victimsoverview", getAllVictimsWithCampDetails);



module.exports = router;
