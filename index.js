

require("dotenv").config();

// FIX: MaxListenersExceededWarning ke liye
require('events').EventEmitter.defaultMaxListeners = 20;

console.log("DEBUG ENV:", process.env.MONGO_URI);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const rootDir = require("./utils/pathUtils");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const paymentRouter = require("./routes/paymentRoutes");
const loginSignupRouter = require("./routes/loginSignupRouter");
const User = require("./model/userSchema");
const Category = require("./model/categorySchema");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  touchAfter: 24 * 3600 
});
store.on("error", console.log);

// SESSION CONFIGURATION
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,               
    saveUninitialized: false,    
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      httpOnly: true,
      sameSite: 'lax' 
    }
  })
);

app.use("/payment/razorpay-webhook", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES: Yahan 'public' folder serve ho raha hai
app.use(express.static(path.join(rootDir, "public")));

app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || null;
    res.locals.admin = req.session.admin || null; 

    // --- DYNAMIC DATA FOR ALL PAGES ---
    // Ab 'allCategories' har view mein available hoga, baar baar fetch nahi hoga
    res.locals.allCategories = await Category.find({}).lean();

    res.locals.wishlistIds = [];
    res.locals.cartProductIds = [];

    if (req.session.isLoggedIn && req.session.user) {
      const user = await User.findById(req.session.user._id).select("wishlist cart");
      if (user?.wishlist?.length) {
        res.locals.wishlistIds = user.wishlist.map(id => id.toString());
      }
      if (user?.cart?.length) {
        res.locals.cartProductIds = user.cart.map(item => item.product.toString());
      }
    }
    next();
  } catch (err) {
    console.error("Global middleware error:", err);
    next();
  }
});

app.use(userRouter);
app.use(adminRouter); 
app.use(loginSignupRouter);
app.use("/", paymentRouter);

// ---------------- ERROR HANDLING (404) ----------------
app.use((req, res, next) => {
  res.status(404);
  res.render("404", { 
    pageTitle: "Page Not Found", 
    isLoggedIn: req.session.isLoggedIn 
  }, (err, html) => {
    if (err) {
      return res.send("<h1>404 - Page Not Found</h1><a href='/'>Go Home</a>");
    }
    res.send(html);
  });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`Visit: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.log("❌ Database connection error:", err));