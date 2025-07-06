const express = require("express");
const {
  initiateSSLPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} = require("../Controllers/SSLCommerzController");

const router = express.Router();

router.post("/ssl-request", initiateSSLPayment);
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

module.exports = router;
