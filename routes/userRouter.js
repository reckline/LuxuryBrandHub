const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const upload = require("../utils/multer");
const path = require("path");

// Models import
const Category = require('../model/categorySchema'); 
const Product = require('../model/productSchema'); 
const Order = require('../model/orderSchema');

// 1. HOME ROUTE
userRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean();
        const brands = await Product.distinct("brand").catch(() => []); 
        
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

// 2. STATIC ROUTES
userRouter.get('/wishlist', userController.getWishlist);
userRouter.get('/add-to-cart', userController.getAddToCart);
userRouter.get('/order-history', userController.getOrderHistory);
userRouter.get("/profile", userController.getProfile);
userRouter.get('/luxuryBoysWatches', (req, res) => res.render('luxuryBoysWatches'));
userRouter.get('/luxuryGirlsWatches', (req, res) => res.render('luxuryGirlsWatches'));

// 3. DYNAMIC ROUTES
userRouter.get('/view-product/:id', userController.getViewProduct);
userRouter.get("/order-success/:id", userController.getOrderSuccess);

// 4. PREFIXED ROUTES (Category & Brand)
userRouter.get('/category/:categoryName', userController.getCategoryProducts);
userRouter.get('/brand/:brandName', userController.getBrandProducts);

// 5. POST ROUTES
userRouter.post("/wishlist/toggle", userController.posttoggleWishlist);
userRouter.post('/add-to-cart', userController.postAddToCart);
userRouter.post('/buy-now', userController.postBuyNowOrder);
userRouter.post("/cart/update-qty", userController.updateCartQty);
userRouter.post("/cart/remove", userController.removeFromCart);
userRouter.post("/cart/checkout", userController.postCartCheckout);
userRouter.post("/order/cancel", userController.cancelOrder);


// userRouter.js mein ye line honi chahiye
userRouter.get('/products/filter', userController.filterProductsByGender);


// 6. UPDATE PROFILE
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

// 7. SMART REDIRECT & FALLBACK (SABSE NICHE)
userRouter.get('/:slug', async (req, res, next) => {
    const slug = req.params.slug;
    try {
        // 1. Check: Kya ye slug koi exist karne wali Category hai?
        const isCategory = await Category.findOne({ name: { $regex: new RegExp('^' + slug + '$', 'i') } });
        if (isCategory) {
            return res.redirect(`/category/${slug}`);
        }

        // 2. AGAR KOI PRODUCT MILTA HAI IS BRAND KA, TABHI BRAND PAGE PAR BHEJO
        // Agar tum chahte ho ki khali brand page bhi dikhe, toh is check ko hata kar
        // seedha "return res.redirect(`/brand/${slug}`)" kar sakte ho.
        const productExists = await Product.findOne({ brand: { $regex: new RegExp('^' + slug + '$', 'i') } });
        
        if (productExists) {
            return res.redirect(`/brand/${slug}`);
        } else {
            // Agar brand ka koi product nahi hai, lekin tum phir bhi page dikhana chahte ho:
            return res.redirect(`/brand/${slug}`); 
        }

    } catch (err) {
        next(err);
    }
});


module.exports = userRouter;