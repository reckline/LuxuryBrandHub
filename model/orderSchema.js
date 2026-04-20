const mongoose = require("mongoose");

// ---------------- ORDER ITEM ----------------
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

// ---------------- ORDER ----------------
const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Products
  items: [orderItemSchema],

  // ⭐ Billing Logic Updates
  totalAmount: {
    type: Number,
    required: true
  },
  advancePaid: { 
    type: Number, 
    default: 0 // इसमें ₹50 या Full Amount आएगा
  },
  amountDue: { 
    type: Number, 
    default: 0 // इसमें बाकी बचा हुआ पैसा आएगा (Total - Advance)
  },

  // Delivery
  name: String,
  mobile: String,
  address: String,
  pincode: String,
  state: String,

  // Payment
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD"
  },

  paymentStatus: {
    type: String,
    // "Partially Paid" खास तौर पर COD Advance (₹50) के लिए जोड़ा गया है
    enum: ["Pending", "Paid", "Partially Paid", "Failed"], 
    default: "Pending"
  },

  paymentId: String, // Razorpay Payment ID

  // Order Status
  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Confirmed"
  },

  // Cancel System
  cancelled: {
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancelledBy: {
      type: String,
      enum: ["user", "admin", null],
      default: null
    },
    cancelReason: { type: String, default: null }
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);