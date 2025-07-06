// Controllers/SSLCommerzController.js
const SSLCommerzPayment = require("sslcommerz-lts");
const Donation = require("../Models/DonationModel");

// Sandbox credentials
const store_id = "testbox";
const store_passwd = "qwerty";
const is_live = false; // true for production

exports.initPayment = async (req, res) => {
  const { name, email, amount, message } = req.body;

  const transactionId = Math.random().toString(36).substring(2, 15);

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: "http://localhost:5553/api/donate/ssl-payment-success",
    fail_url: "http://localhost:5553/api/donate/ssl-payment-fail",
    cancel_url: "http://localhost:5553/api/donate/ssl-payment-cancel",
    ipn_url: "http://localhost:5553/api/donate/ipn",

    cus_name: name,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_phone: "01711111111",

    shipping_method: "NO",
    product_name: "Rescue Donation",
    product_category: "Donation",
    product_profile: "non-physical-goods",

    value_a: message || "", // optional field to pass extra data like message
     value_a: name,
      value_b: email,
      value_c: message || "",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    const apiResponse = await sslcz.init(data);
    if (apiResponse?.GatewayPageURL) {
      res.status(200).json({ url: apiResponse.GatewayPageURL });
    } else {
      res.status(400).json({ message: "Payment session failed", error: apiResponse });
    }
  } catch (error) {
    console.error("SSLCommerz init error:", error);
    res.status(500).json({ message: "Payment initialization failed", error });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const {
      value_a, // name
      value_b, // email
      value_c, // message
      amount,
    } = req.body;

    const newDonation = new Donation({
      name: value_a,
      email: value_b,
      amount: parseFloat(amount),
      message: value_c,
      balance_amount: parseFloat(amount),
      money_Spent: 0,
      money_Spent_For: [],
    });

    await newDonation.save();

    // Pass values as query params to frontend
    return res.redirect(
      `http://localhost:3000/donation-success?name=${encodeURIComponent(value_a)}&email=${encodeURIComponent(
        value_b
      )}&amount=${amount}&message=${encodeURIComponent(value_c)}`
    );
  } catch (err) {
    console.error("Payment success error:", err);
    res.status(500).json({ message: "Error on payment success", error: err.message });
  }
};



exports.paymentFail = (req, res) => {
  return res.redirect("http://localhost:3000/donation-fail");
};

exports.paymentCancel = (req, res) => {
  return res.redirect("http://localhost:3000/donation-cancel");
};
