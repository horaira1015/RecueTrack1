const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  balance_amount: {
    type: Number,
    required: true, // Frontend must explicitly update this
  },
  money_Spent: {
    type: Number,
    required: true, // Frontend must explicitly update this
  },
  money_Spent_For: [
    {
      For: String, // Purpose of spending
      amount: Number, // Amount spent
      date: {
        type: Date,
        default: Date.now, // Date of transaction
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("tbl_donations", DonationSchema);

module.exports = Donation;
