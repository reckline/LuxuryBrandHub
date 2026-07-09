const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const upload = require("../utils/multer");

// Models import
const Category = require('../model/categorySchema'); 
const Product = require('../model/productSchema'); 

// Updated Home Route with robust error handling
userRouter.get('/', async (req, res, next) => {
    try {
        // Lean() use kiya hai taaki performance fast ho (Live server ke liye best hai)
        const categories = await Category.find({}).lean();
        
        // Agar database se data nahi mil raha, toh empty array bhejo, crash mat hone do
        const brands = await Product.distinct("brand").catch(() => []); 
        
        res.render('user/home', { 
            categories: categories || [], 
            brands: brands || [],
            isLoggedIn: req.session?.isLoggedIn || false,
            user: req.session?.user || null 
        });
    } catch (error) {
        console.error("Home Route Error:", error);
        // Error aane par 500 render karne ki jagah next(error) karo
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