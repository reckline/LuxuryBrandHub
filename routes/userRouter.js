const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const upload = require("../utils/multer");
const path = require("path");

// Models import
const Category = require('../model/categorySchema'); 
const Product = require('../model/productSchema'); 

// FIX: Path changed to 'User/home' because file is in views/User/home.ejs
userRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean();
        const brands = await Product.distinct("brand").catch(() => []); 
        
        // FIX: 'User/home' kyunki file views/User/home.ejs mein hai
        const viewPath = 'User/home'; 
        
        res.render(viewPath, { 
            categories: categories || [], 
            brands: brands || [],
            isLoggedIn: req.session?.isLoggedIn || false,
            user: req.session?.user || null 
        });
    } catch (error) {
        console.error("Home Route Error:", error);
        next(error);
    }
});

// Baki routes mein bhi 'User/' prefix add karna hoga
userRouter.get('/luxuryBoysWatches', (req, res) => res.render('User/luxuryBoysWatches'));
userRouter.get('/luxuryGirlsWatches', (req, res) => res.render('User/luxuryGirlsWatches'));
// ... Note: Agar ye routes controller se aa rahe hain, toh controller ke andar res.render mein 'User/' prefix lagana padega.

// FIX: Wishlist aur Cart routes ke liye
userRouter.get('/wishlist', userController.getWishlist); // Controller mein res.render('User/wishlist') karna
userRouter.get('/add-to-cart', userController.getAddToCart); // Controller mein res.render('User/add-to-cart') karna

userRouter.post("/wishlist/toggle", userController.posttoggleWishlist);
userRouter.post('/add-to-cart', userController.postAddToCart);
userRouter.get('/product/:id', userController.getViewProduct); // Controller mein res.render('User/view-product') karna
userRouter.get("/order-success/:id", userController.getOrderSuccess);
userRouter.post('/buy-now', userController.postBuyNowOrder);
userRouter.get('/order-history', userController.getOrderHistory); // Controller mein res.render('User/orderHistory') karna

userRouter.post("/cart/update-qty", userController.updateCartQty);
userRouter.post("/cart/remove", userController.removeFromCart);
userRouter.post("/cart/checkout", userController.postCartCheckout);
userRouter.post("/order/cancel", userController.cancelOrder);

// GET PROFILE
userRouter.get("/profile", userController.getProfile); // Controller mein res.render('User/profile') karna

// POST UPDATE PROFILE
userRouter.post(
  "/update-user-data",
  (req, res, next) => {
    upload.single("profilePhoto")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Image must be under 2MB");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  userController.updateUserData
);

module.exports = userRouter;