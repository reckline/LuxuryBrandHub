const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const upload = require("../utils/multer");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    // Session check
    if (!req.session || !req.session.isLoggedIn || !req.session.user) {
        console.log("DEBUG: Session Missing or Incomplete:", req.session);
        return res.status(401).send("Unauthorized: Please login first.");
    }
    return next();
};

// --- DASHBOARD ROUTES (All prefixed with /admin via index.js) ---
adminRouter.get('/admin-home', isAuthenticated, adminController.getAdminHome);
adminRouter.get('/admin-userlist', isAuthenticated, adminController.getAdminUsersList);
adminRouter.get('/admin-seeuseralldetails/:id', isAuthenticated, adminController.getAdminSeeUserAllDetails);
adminRouter.get('/admin-newoder', isAuthenticated, adminController.getAdminNewOrders);
adminRouter.post('/admin-update-order-status', isAuthenticated, adminController.postAdminUpdateOrderStatus);
adminRouter.get('/admin-order-history', isAuthenticated, adminController.getAdminOrderHistory);
adminRouter.get('/totalproducts', adminController.getTotalProductsCount);
adminRouter.get('/totalpendingorders', adminController.getTotalPendingOrdersCount);
adminRouter.get('/cancel-orders', adminController.getCancelOrders);
adminRouter.get('/totalcomplitedorders', adminController.getTotalComplitedOrdersCount);
adminRouter.get('/totalorders', adminController.getTotalOrdersCount);
adminRouter.get('/todaysorders', adminController.getTodaysOrdersCount);
adminRouter.get('/yesterdayorders', adminController.getYesterdayOrdersCount);
adminRouter.get('/total-sales', adminController.getTotalSales);
adminRouter.get('/todaysale', adminController.getTodaySales);
adminRouter.get('/yesterdaysale', adminController.getYesterdaySales);

// --- CATEGORY & BRAND ROUTES ---
adminRouter.get('/admin-category', isAuthenticated, adminController.getAdminCategory);
adminRouter.post('/delete-category/:id', isAuthenticated, adminController.deleteCategory);
adminRouter.get('/category/:name', adminController.getCategoryPage);

// Unified add-brand route
adminRouter.post('/add-brand', isAuthenticated, upload.single('brandImage'), adminController.addBrandToCategory);
adminRouter.post('/delete-brand', isAuthenticated, adminController.deleteBrand);

adminRouter.post('/add-category', isAuthenticated, upload.single('categoryImage'), adminController.postAddCategory);

// --- SIZE MANAGEMENT ---
adminRouter.post('/add-size', isAuthenticated, adminController.addSize);
adminRouter.post('/delete-size', isAuthenticated, adminController.deleteSize);

// --- DYNAMIC PRODUCT ROUTES ---
adminRouter.get('/products/:categoryName', adminController.getCategoryProducts);

// 2. Add Product (Universal)
adminRouter.post(
  "/products/add",
  isAuthenticated, 
  (req, res, next) => {
    upload.array("images", 4)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") return res.status(400).send("Each image must be under 2MB");
        if (err.code === "LIMIT_FILE_COUNT") return res.status(400).send("Maximum 4 images allowed");
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postCategoryProduct
);

// 3. Edit Product (Universal)
adminRouter.post(
  "/products/edit",
  isAuthenticated,
  (req, res, next) => {
    upload.array("images", 4)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") return res.status(400).send("Each image must be under 2MB");
        if (err.code === "LIMIT_FILE_COUNT") return res.status(400).send("Maximum 4 images allowed");
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postCategoryProductEdit
);

module.exports = adminRouter;