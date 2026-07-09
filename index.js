require("dotenv").config();

// FIX: MaxListenersExceededWarning
require('events').EventEmitter.defaultMaxListeners = 20;

console.log("DEBUG ENV:", process.env.MONGO_URI ? "Loaded" : "Missing");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const rootDir = __dirname; 
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const paymentRouter = require("./routes/paymentRoutes");
const loginSignupRouter = require("./routes/loginSignupRouter");
const User = require("./model/userSchema");
const Category = require("./model/categorySchema");

const app = express();

// --- FIX: MULTI-PATH VIEWS CONFIGURATION ---
// Isse Express 'views', 'views/User', aur 'views/Admin' teeno jagah file dhoondhega
app.set("view engine", "ejs");
app.set("views", [
    path.join(rootDir, "views"),
    path.join(rootDir, "views", "User"),
    path.join(rootDir, "views", "Admin")
]);

console.log("✅ Views directories set for automatic lookup");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  touchAfter: 24 * 3600
});
store.on("error", (err) => console.log("Session Store Error:", err));

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

// STATIC FILES
app.use(express.static(path.join(rootDir, "public")));

// GLOBAL MIDDLEWARE
app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = req.session?.isLoggedIn || false;
    res.locals.user = req.session?.user || null;
    res.locals.admin = req.session?.admin || null; 

    res.locals.allCategories = await Category.find({}).lean().catch(() => []);

    res.locals.wishlistIds = [];
    res.locals.cartProductIds = [];

    if (req.session?.isLoggedIn && req.session?.user) {
      const user = await User.findById(req.session.user._id).select("wishlist cart").lean();
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

// ERROR HANDLING (404)
app.use((req, res, next) => {
  res.status(404);
  res.render("404", { 
    pageTitle: "Page Not Found", 
    isLoggedIn: req.session?.isLoggedIn || false 
  }, (err, html) => {
    if (err) {
      console.error("404 View Error:", err);
      return res.status(404).send("<h1>404 - Page Not Found</h1>");
    }
    res.send(html);
  });
});

// CRITICAL ERROR HANDLING (500)
app.use((err, req, res, next) => {
    console.error("CRITICAL SERVER ERROR:", err.stack);
    res.status(500).send(`<h1>500 Internal Server Error</h1><pre>${err.message}</pre>`);
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ Database connection error:", err));