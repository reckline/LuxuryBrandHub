const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const paymentController = require("../controller/paymentController");


// ==============================
// CREATE RAZORPAY ORDER
// ==============================
router.post("/create-order", paymentController.createOrder);


// ==============================
// VERIFY PAYMENT (Frontend)
// ==============================
router.post("/verify-payment", paymentController.verifyPayment);


// ==============================
// RAZORPAY WEBHOOK
// ==============================
router.post("/razorpay-webhook", express.json(), async (req, res) => {

  try {

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {

      console.log("✅ Webhook Verified");

      const event = req.body.event;

      if (event === "payment.captured") {

        const payment = req.body.payload.payment.entity;

        console.log("💳 Payment Captured");
        console.log("Payment ID:", payment.id);
        console.log("Amount:", payment.amount / 100);
        console.log("Email:", payment.email);
        console.log("Contact:", payment.contact);

        // 👉 Yaha future me order update kar sakte ho
      }

      res.json({ status: "ok" });

    } else {

      console.log("❌ Invalid Webhook Signature");

      res.status(400).json({
        status: "invalid signature"
      });

    }

  } catch (error) {

    console.log("Webhook Error:", error);

    res.status(500).json({
      status: "error"
    });

  }

});


module.exports = router;