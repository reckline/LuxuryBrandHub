const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const upload = require("../utils/multer");
const path = require("path");

// Models import
const Category = require('../model/categorySchema'); 
const Product = require('../model/productSchema'); 

// 1. HOME ROUTE
userRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean();
        const brands = await Product.distinct("brand").catch(() => []); 
        
        // Tumhari files direct 'views' folder mein hain, toh path 'home' hoga, 'User/home' nahi
        res.render('home', { 
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

// 2. STATIC ROUTES (Pehle define karo)
userRouter.get('/wishlist', userController.getWishlist);
userRouter.get('/add-to-cart', userController.getAddToCart);
userRouter.get('/order-history', userController.getOrderHistory);
userRouter.get("/profile", userController.getProfile);
userRouter.get('/luxuryBoysWatches', (req, res) => res.render('luxuryBoysWatches'));
userRouter.get('/luxuryGirlsWatches', (req, res) => res.render('luxuryGirlsWatches'));

// 3. POST ROUTES
userRouter.post("/wishlist/toggle", userController.posttoggleWishlist);
userRouter.post('/add-to-cart', userController.postAddToCart);
userRouter.post('/buy-now', userController.postBuyNowOrder);
userRouter.post("/cart/update-qty", userController.updateCartQty);
userRouter.post("/cart/remove", userController.removeFromCart);
userRouter.post("/cart/checkout", userController.postCartCheckout);
userRouter.post("/order/cancel", userController.cancelOrder);

// 4. DYNAMIC ROUTES (Dhyan rahe: ye sabse niche hone chahiye)
userRouter.get('/product/:id', userController.getViewProduct);
userRouter.get("/order-success/:id", userController.getOrderSuccess);

// YEH DYNAMIC ROUTE HAMESHA SABSE NICHE RAKHO
userRouter.get('/:categoryName', userController.getCategoryProducts);

// 5. UPDATE PROFILE
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