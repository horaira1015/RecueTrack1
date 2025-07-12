// routes/leaderRoutes.js
const express = require("express");
const router = express.Router();
const LeaderController = require("../Controllers/LeaderController");
const multer = require("multer");

// Configure multer storage (optional: customize destination/filename)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists or handle accordingly
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/Reg", upload.single("idProof"), LeaderController.registerLeader);
router.post("/login", LeaderController.loginLeader);
router.get("/get", LeaderController.getLeaders);
router.get("/:id", LeaderController.getLeaderById);
router.put("/:id", LeaderController.updateLeader);
router.delete("/:id", LeaderController.deleteLeader);

module.exports = router;
