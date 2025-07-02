const express = require("express");
const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonationById,
  deleteDonation,
} = require("../Controllers/DonationController");

const router = express.Router();

// Create a new donation
router.post("/donations", createDonation);

// Get all donations
router.get("/donations", getAllDonations);

// Get a donation by ID
router.get("/donations/:id", getDonationById);

// Update a donation by ID
router.put("/donations/:id", updateDonationById);

// Delete a donation by ID
router.delete("/donations/:id", deleteDonation);

module.exports = router;
