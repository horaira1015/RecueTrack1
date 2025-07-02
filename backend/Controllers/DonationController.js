const Donation = require("../Models/DonationModel");

// Create a new donation (Donors can submit name, email, amount, and message)
const createDonation = async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;

    if (!name || !email || amount === undefined) {
      return res.status(400).json({ success: false, message: "Name, email, and amount are required" });
    }

    const newDonation = new Donation({
      name,
      email,
      amount,
      message,
      balance_amount: amount, // Initially, balance is the full donation amount
      money_Spent: 0,  // Initialize spent money as 0
      money_Spent_For: [] // Initialize empty array for tracking spending
    });

    await newDonation.save();
    res.status(201).json({ success: true, message: "Donation recorded successfully", donation: newDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving donation", error: error.message });
  }
};

// Get all donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching donations", error: error.message });
  }
};

// Get donation by ID
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    res.status(200).json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching donation", error: error.message });
  }
};

// Update donation (Admin updates money spent and purpose)
const updateDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { moneySpent, moneySpentFor } = req.body;

    // Validate required fields
    if (moneySpent === undefined || !moneySpentFor) {
      return res.status(400).json({ success: false, message: "Money spent and purpose are required" });
    }

    // Fetch existing donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    // Update money spent details
    const newSpentEntry = {
      For: moneySpentFor,
      amount: moneySpent,
      date: new Date(),
    };

    donation.money_Spent += moneySpent;
    donation.money_Spent_For.push(newSpentEntry);
    donation.balance_amount = donation.amount - donation.money_Spent;

    const updatedDonation = await donation.save();

    res.status(200).json({ success: true, message: "Donation updated successfully", donation: updatedDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating donation", error: error.message });
  }
};

// Delete a donation by ID
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDonation = await Donation.findByIdAndDelete(id);

    if (!deletedDonation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting donation", error: error.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonationById,
  deleteDonation,
};
