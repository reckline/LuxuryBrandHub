const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const upload = require("../utils/multer");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    // DEBUG: Checking session state
    if (!req.session || !req.session.isLoggedIn || !req.session.user) {
        console.log("DEBUG: Session Missing or Incomplete:", req.session);
        return res.status(401).send("Unauthorized: Please login first.");
    }
    return next();
};

// --- DASHBOARD ROUTES ---
adminRouter.get('/admin-home', adminController.getAdminHome);
adminRouter.get('/admin-userlist', adminController.getAdminUsersList);
adminRouter.get('/admin-seeuseralldetails/:id', adminController.getAdminSeeUserAllDetails);
adminRouter.get('/admin-newoder', adminController.getAdminNewOrders);
adminRouter.post('/admin-update-order-status', adminController.postAdminUpdateOrderStatus);
adminRouter.get('/admin-order-history', adminController.getAdminOrderHistory);
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
adminRouter.get('/admin-category', adminController.getAdminCategory);
adminRouter.post('/admin/delete-category/:id', adminController.deleteCategory);
adminRouter.get('/admin/category/:name', adminController.getCategoryPage);
adminRouter.post('/admin/add-brand', adminController.addBrandToCategory);
adminRouter.post('/admin/delete-brand', adminController.deleteBrand);
adminRouter.get('/admin/category/:categoryName', adminController.getCategoryProducts);
adminRouter.post('/admin/add-category', upload.single('categoryImage'), adminController.postAddCategory);

// --- SIZE MANAGEMENT ---
adminRouter.post('/admin-add-size', adminController.addSize);
adminRouter.post('/admin-delete-size', adminController.deleteSize);

// --- DYNAMIC PRODUCT ROUTES ---
adminRouter.get('/admin/products/:categoryName', adminController.getCategoryProducts);

// 2. Add Product (Universal) - Added isAuthenticated middleware
adminRouter.post(
  "/admin/products/add",
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

// 3. Edit Product (Universal) - Added isAuthenticated middleware
adminRouter.post(
  "/admin/products/edit",
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