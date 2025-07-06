const express = require("express");
const sslCommerzPayment = require("../Controllers/SSLCommerzController");

const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonationById,
  deleteDonation,
} = require("../Controllers/DonationController");

const router = express.Router();



// New route to initiate payment
router.post("/init-payment", sslCommerzPayment.initPayment);

// Optional: handle success/fail/cancel from SSLCommerz
router.post("/ssl-payment-success", sslCommerzPayment.paymentSuccess);
router.post("/ssl-payment-fail", sslCommerzPayment.paymentFail);
router.post("/ssl-payment-cancel", sslCommerzPayment.paymentCancel);

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
