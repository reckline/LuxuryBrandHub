const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const upload = require("../utils/multer");
const path = require("path");

// Models import
const Category = require('../model/categorySchema'); 
const Product = require('../model/productSchema'); 

// FIX: Path changed to 'home' because file is in views/home.ejs
userRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean();
        const brands = await Product.distinct("brand").catch(() => []); 
        
        // FIX: 'user/home' ki jagah 'home' use kiya hai kyunki file views/home.ejs mein hai
        const viewPath = 'home'; 
        
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

// Baki routes waise hi hain
userRouter.get('/luxuryBoysWatches', userController.getLuxuryBoysWatches);
userRouter.get('/luxuryGirlsWatches', userController.getLuxuryGirlsWatches);
userRouter.get('/allgoogles', userController.getAllGoogles);
userRouter.get('/luxuryladishsbags', userController.getAllLuxuryLadiesBags);

userRouter.get('/adidas', userController.getAdidasProducts);
userRouter.get('/asics', userController.getAsicsProducts);
userRouter.get('/puma', userController.getPumaProducts);
userRouter.get('/hoka', userController.getHokaProducts);
userRouter.get('/nb', userController.getNbProducts);
userRouter.get('/reebok', userController.getReebokProducts);
userRouter.get('/crocs', userController.getCrocsProducts);
userRouter.get('/sliders', userController.getSlidersProducts);
userRouter.get('/nike', userController.getNikeProducts);

userRouter.get('/allClothes', userController.getAllClothesProducts);
userRouter.get('/allshoes', userController.getAllShoesProducts);
userRouter.get('/allGoogles', userController.getAllGooglesProducts);
userRouter.get('/allWatches', userController.getAllWatchesProducts);

userRouter.post("/wishlist/toggle", userController.posttoggleWishlist);
userRouter.get('/wishlist', userController.getWishlist);
userRouter.get('/add-to-cart', userController.getAddToCart);
userRouter.post('/add-to-cart', userController.postAddToCart);
userRouter.get('/product/:id', userController.getViewProduct);
userRouter.get("/order-success/:id", userController.getOrderSuccess);
userRouter.post('/buy-now', userController.postBuyNowOrder);
userRouter.get('/order-history', userController.getOrderHistory);

userRouter.post("/cart/update-qty", userController.updateCartQty);
userRouter.post("/cart/remove", userController.removeFromCart);
userRouter.post("/cart/checkout", userController.postCartCheckout);
userRouter.post("/order/cancel", userController.cancelOrder);

// GET PROFILE
userRouter.get("/profile", userController.getProfile);

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