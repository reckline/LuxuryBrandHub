const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ============================
// CREATE RAZORPAY ORDER
// ============================

exports.createOrder = async (req, res) => {

  try {

    const { productId, qty, paymentMethod } = req.body;

    if (!productId || !qty) {
      return res.json({
        success: false,
        message: "Invalid request"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      });
    }

    const quantity = parseInt(qty);

    if (product.totalStock < quantity) {
      return res.json({
        success: false,
        message: "Product out of stock"
      });
    }

    // ======================
    // AMOUNT CALCULATION
    // ======================

    let amount = 0;

    if (paymentMethod === "COD") {

      // COD advance ₹50
      amount = 50;

    } else {

      // Full online payment
      amount = product.offerPrice * quantity;

    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay paisa
      currency: "INR",
      receipt: "order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {

    console.log("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });

  }

};



// ============================
// VERIFY PAYMENT + SAVE ORDER
// ============================

exports.verifyPayment = async (req, res) => {

  try {

    const {

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      productId,
      qty,
      size,

      name,
      mobile,
      address,
      pincode,
      state,

      paymentMethod

    } = req.body;


    const quantity = parseInt(qty);


    // ======================
    // 1️⃣ VERIFY SIGNATURE
    // ======================

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {

      return res.json({
        success: false,
        message: "Invalid payment signature"
      });

    }


    // ======================
    // 2️⃣ FETCH PAYMENT
    // ======================

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status !== "captured") {

      return res.json({
        success: false,
        message: "Payment not captured"
      });

    }


    // ======================
    // 3️⃣ PRODUCT CHECK
    // ======================

    const product = await Product.findById(productId);

    if (!product) {

      return res.json({
        success: false,
        message: "Product not found"
      });

    }

    if (product.totalStock < quantity) {

      return res.json({
        success: false,
        message: "Product out of stock"
      });

    }


    // ======================
    // 4️⃣ UPDATE STOCK
    // ======================

    product.totalStock -= quantity;

    await product.save();


    // ======================
    // 5️⃣ BILL CALCULATION
    // ======================

    const billAmount = product.offerPrice * quantity;

    let advancePaid = 0;

    if (paymentMethod === "COD") {

      advancePaid = 50;

    } else {

      advancePaid = billAmount;

    }

    const due = billAmount - advancePaid;


    // ======================
    // 6️⃣ CREATE ORDER
    // ======================

    const order = new Order({

      user: req.session?.user?._id || null,

      items: [
        {
          product: productId,
          qty: quantity,
          size: size || "",
          price: product.offerPrice,
          total: billAmount
        }
      ],

      totalAmount: billAmount,

      advancePaid: advancePaid,

      amountDue: due > 0 ? due : 0,

      name,
      mobile,
      address,
      pincode,
      state,

      paymentMethod,

      paymentStatus: due <= 0 ? "Paid" : "Partially Paid",

      paymentId: razorpay_payment_id,

      orderStatus: "Confirmed"

    });

    await order.save();


    // ======================
    // SUCCESS RESPONSE
    // ======================

    res.json({
      success: true,
      orderId: order._id
    });

  } catch (err) {

    console.log("Verify Payment Error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};