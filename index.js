
require("dotenv").config();
console.log("DEBUG ENV:", process.env.MONGO_URI);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


// Import routes
const rootDir = require("./utils/pathUtils");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const paymentRouter = require("./routes/paymentRoutes");
const loginSignupRouter = require("./routes/loginSignupRouter");
const User = require("./model/userSchema"); // 🔥 MUST


// ---------------- EXPRESS APP ----------------
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// ---------------- SESSION STORE ----------------
const store = new MongoDBStore({
  uri: process.env.MONGO_URI, // from .env
  collection: "sessions",
});
store.on("error", console.log);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // from .env
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// ---------------- PARSERS ----------------
app.use("/payment/razorpay-webhook", express.raw({ type: "*/*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- CUSTOM MIDDLEWARE ----------------
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || null;
    res.locals.wishlistIds = [];

    if (req.session.isLoggedIn && req.session.user) {
      const user = await User.findById(req.session.user._id)
        .select("wishlist");

      if (user?.wishlist?.length) {
        res.locals.wishlistIds = user.wishlist.map(id =>
          id.toString()
        );
      }
    }

    next();
  } catch (err) {
    console.error("Wishlist middleware error:", err);
    next();
  }
});


app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || null;

    res.locals.wishlistIds = [];
    res.locals.cartProductIds = []; // ✅ ADD THIS

    if (req.session.isLoggedIn && req.session.user) {
      const user = await User.findById(req.session.user._id)
        .select("wishlist cart");

      // ❤️ Wishlist
      if (user?.wishlist?.length) {
        res.locals.wishlistIds = user.wishlist.map(id => id.toString());
      }

      // 🛒 Cart
      if (user?.cart?.length) {
        res.locals.cartProductIds = user.cart.map(item =>
          item.product.toString()
        );
      }
    }

    next();
  } catch (err) {
    console.error("Global middleware error:", err);
    next();
  }
});

// ---------------- STATIC ----------------
app.use(express.static(path.join(rootDir, "public")));

// ❌ Remove local /uploads serving (Cloudinary handles hosting)

// ---------------- ROUTES ----------------
app.use(userRouter);
app.use(adminRouter);
app.use(loginSignupRouter);
app.use("/", paymentRouter);
// app.use("/payment", paymentRouter);


// ---------------- ERROR HANDLING ---------------- <--- isko bhi krna h important
// 404 Page
// app.use((req, res, next) => {
//   res.status(404).render("404", { isLoggedIn: req.session.isLoggedIn });
// });

// ---------------- DATABASE + SERVER ----------------
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

