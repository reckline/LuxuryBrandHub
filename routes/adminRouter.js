const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const upload = require("../utils/multer");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn || !req.session.user) {
        console.log("DEBUG: Session Missing or Incomplete:", req.session);
        return res.status(401).send("Unauthorized: Please login first.");
    }
    return next();
};

// --- DASHBOARD ROUTES (Access: /admin/home, /admin/userlist, etc.) ---
adminRouter.get('/home', isAuthenticated, adminController.getAdminHome);
adminRouter.get('/userlist', isAuthenticated, adminController.getAdminUsersList);
adminRouter.get('/seeuseralldetails/:id', isAuthenticated, adminController.getAdminSeeUserAllDetails);
adminRouter.get('/newoder', isAuthenticated, adminController.getAdminNewOrders);
adminRouter.post('/update-order-status', isAuthenticated, adminController.postAdminUpdateOrderStatus);
adminRouter.get('/order-history', isAuthenticated, adminController.getAdminOrderHistory);

// Stats & Data
adminRouter.get('/totalproducts', isAuthenticated, adminController.getTotalProductsCount);
adminRouter.get('/totalpendingorders', isAuthenticated, adminController.getTotalPendingOrdersCount);
adminRouter.get('/cancel-orders', isAuthenticated, adminController.getCancelOrders);
adminRouter.get('/totalcomplitedorders', isAuthenticated, adminController.getTotalComplitedOrdersCount);
adminRouter.get('/totalorders', isAuthenticated, adminController.getTotalOrdersCount);
adminRouter.get('/todaysorders', isAuthenticated, adminController.getTodaysOrdersCount);
adminRouter.get('/yesterdayorders', isAuthenticated, adminController.getYesterdayOrdersCount);
adminRouter.get('/total-sales', isAuthenticated, adminController.getTotalSales);
adminRouter.get('/todaysale', isAuthenticated, adminController.getTodaySales);
adminRouter.get('/yesterdaysale', isAuthenticated, adminController.getYesterdaySales);

// --- CATEGORY & BRAND ROUTES ---
adminRouter.get('/category', isAuthenticated, adminController.getAdminCategory);
adminRouter.post('/delete-category/:id', isAuthenticated, adminController.deleteCategory);
adminRouter.get('/category/:name', isAuthenticated, adminController.getCategoryPage);

// Brand Management
adminRouter.post('/add-brand', isAuthenticated, upload.single('brandImage'), adminController.addBrandToCategory);
adminRouter.post('/delete-brand', isAuthenticated, adminController.deleteBrand);
adminRouter.post('/add-category', isAuthenticated, upload.single('categoryImage'), adminController.postAddCategory);

// --- SIZE MANAGEMENT ---
adminRouter.post('/add-size', isAuthenticated, adminController.addSize);
adminRouter.post('/delete-size', isAuthenticated, adminController.deleteSize);

// --- DYNAMIC PRODUCT ROUTES ---
adminRouter.get('/products/:categoryName', isAuthenticated, adminController.getCategoryProducts);

adminRouter.post('/admin-update-order-status', adminController.postAdminUpdateOrderStatus);


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