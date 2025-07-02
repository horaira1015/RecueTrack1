const express = require("express");
const router = express.Router();

// Controller function that handles forgot password logic
const { forgotPassword } = require("../Controllers/ForgotPassController");

// Route: POST /api/authe/forgot-password
router.post("/forgot-password", forgotPassword);

module.exports = router;
