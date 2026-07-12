






const User = require("../model/userSchema");
const Product = require("../model/productSchema");
const Order = require("../model/orderSchema");
const uploadToPhpServer = require("../utils/uploadToPhpServer");
const Category = require('../model/categorySchema');

// --- UNIVERSAL HELPER (Do not remove) ---
const getProductsByCategory = async (categoryIdentifier, filter) => {
    const categoryDoc = await Category.findOne({ 
        $or: [{ name: categoryIdentifier }, { _id: categoryIdentifier }] 
    });

    let findQuery = {};
    if (categoryDoc) {
        findQuery = { 
            $or: [{ category: categoryDoc._id.toString() }, { category: categoryDoc.name }] 
        };
    } else {
        findQuery = { category: categoryIdentifier };
    }

    if (filter === "show") findQuery.status = "active";
    if (filter === "hide") findQuery.status = "inactive";

    return await Product.find(findQuery).sort({ createdAt: -1 });
};

// --- CONTROLLER FUNCTIONS ---

exports.getAdminHome = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.redirect("/login");
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.render("Admin/adminHome", { isLoggedIn: req.session.isLoggedIn, admin: req.session.user, users: users });
  } catch (error) { next(error); }
};

exports.getAdminCategory = async (req, res) => {
    try {
        const categories = await Category.find({}).lean();
        res.render('Admin/admin-category', { admin: req.session.admin || { username: 'Admin' }, categories: categories });
    } catch (err) { res.status(500).send("Error loading categories"); }
};

exports.getAdminUsersList = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.redirect("/login");
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.render("Admin/userList", { isLoggedIn: req.session.isLoggedIn, admin: req.session.user, users: users });
  } catch (error) { next(error); }
};

// --- DYNAMIC PRODUCT FUNCTIONS ---
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const categoryName = req.params.categoryName;
    
    // 1. Category search (Error fix ke liye)
    const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
    if (!categoryDoc) {
      return res.status(404).send("Category not found");
    }

    // 2. Products fetch
    const products = await getProductsByCategory(categoryDoc._id, req.query.filter);
    
    // 3. FIX: Ab hum hamesha 'Admin/adminAllProducts' file ko render karenge
    res.render("Admin/adminAllProducts", { 
        admin: req.session.user, 
        products, 
        categoryName: categoryName, // Page pe dikhane ke liye
        selectedFilter: req.query.filter || "all", 
        isLoggedIn: req.session.isLoggedIn 
    });
  } catch (err) { 
    console.error("DEBUG: View load error:", err);
    res.status(500).send("Error loading products view: " + err.message); 
  }
};

exports.postCategoryProduct = async (req, res, next) => {
  try {
    const { title, price, category, ...rest } = req.body;
    
    // 1. Image upload handle karein
    let imageUrls = [];
    if (req.files && req.files.length > 0) { 
        for (let file of req.files) { 
            const url = await uploadToPhpServer(file.path); 
            imageUrls.push(url); 
        } 
    }

    // FIX: Agar images array empty hai, toh default image use karein taaki schema validation pass ho
    if (imageUrls.length === 0) {
        imageUrls = ['/default-shoe.png']; 
    }

    // 2. Safe check for user ID
    const userId = req.session.user ? req.session.user._id : null;
    
    if (!userId) {
        return res.status(401).send("Session expired. Please login again.");
    }

    // 3. Product save karein
    const product = new Product({ 
        title, 
        price, 
        category: category || null, 
        images: imageUrls, 
        ...rest,
        createdBy: userId 
    });

    await product.save();
    
    console.log("SUCCESS: Product saved successfully");

    // FIX: Redirection logic - Safe ID resolution
    let categoryName = category; 
    
    // Check if category is a valid MongoDB ObjectId hex string (24 chars)
    const isObjectId = category && /^[0-9a-fA-F]{24}$/.test(category);
    
    if (isObjectId) {
        try {
            const categoryDoc = await Category.findById(category);
            if (categoryDoc && categoryDoc.name) {
                categoryName = categoryDoc.name;
            }
        } catch (err) {
            console.log("Skipping ID lookup, using raw category value");
        }
    }
    
    // URL safe banane ke liye spaces hatayein
    const cleanCategoryName = (categoryName || "Products").replace(/\s+/g, '');
    
    res.redirect(`/admin/products/${cleanCategoryName}`); 

  } catch (err) { 
    console.error("CRITICAL ERROR in postCategoryProduct:", err); 
    res.status(500).send("Error saving product: " + err.message); 
  }
};

exports.postCategoryProductEdit = async (req, res, next) => {
  try {
    const { productId, category, ...updateData } = req.body;

    // 1. Log incoming data to spot the culprit
    console.log("DEBUG: Incoming Update Data:", updateData);

    // 2. Image Logic: Sirf tabhi overwrite karo agar nayi files aayin
    if (req.files && req.files.length > 0) {
        let imageUrls = [];
        for (let file of req.files) { 
            imageUrls.push(await uploadToPhpServer(file.path)); 
        }
        updateData.images = imageUrls;
    } else {
        // Agar files nahi hain, toh 'images' key ko delete kar do
        // Taaki Mongoose purane DB data ko na chhuye
        delete updateData.images;
    }

    // 3. Update only provided fields
    const updatedProduct = await Product.findByIdAndUpdate(
        productId, 
        { $set: updateData }, 
        { new: true }
    );
    
    console.log("SUCCESS: Product updated safely.");

    // Redirect logic
    const categoryDoc = await Category.findById(category).catch(() => null);
    const categoryName = categoryDoc ? categoryDoc.name.replace(/\s+/g, '') : "Products";
    res.redirect(`/admin/products/${categoryName}`);

  } catch (err) { 
    console.error("CRITICAL ERROR in edit:", err);
    res.status(500).send("Error updating product: " + err.message); 
  }
};

// --- ALL EXISTING FUNCTIONS RETAINED ---
exports.getAdminSeeUserAllDetails = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Access denied.");
    const user = await User.findById(req.params.id).lean();
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-seeuseralldetails", { user, orders, isLoggedIn: req.session.isLoggedIn, admin: req.session.user });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getAdminNewOrders = async (req, res) => {
  try {
    if (!req.session.isLoggedIn || req.session.user.role !== "admin") return res.redirect("/login");
    const orders = await Order.find({ orderStatus: { $nin: ["Delivered", "Cancelled"] } }).populate("user").populate("items.product").sort({ createdAt: -1 });
    res.render("Admin/admin-neworder", { orders, isLoggedIn: req.session.isLoggedIn, admin: req.session.user });
  } catch (err) { res.status(500).send("Error loading orders"); }
};
exports.postAdminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Debugging: Check karo kya aa raha hai
    console.log("Updating Order ID:", orderId, "to Status:", status);

    const order = await Order.findById(orderId);
    if (!order) {
        console.error("Order not found in DB:", orderId);
        return res.status(404).send("Order not found");
    }

    // Status Update Logic
    if (status === "Cancelled") { 
        order.orderStatus = "Cancelled"; 
        order.cancelled = { 
            isCancelled: true, 
            cancelledAt: new Date(), 
            cancelledBy: "admin" 
        }; 
    } else if (status === "Delivered") { 
        order.orderStatus = "Delivered"; 
        order.paymentStatus = "Paid"; 
        
        await User.findByIdAndUpdate(order.user, { 
            $inc: { 
                totalSpend: order.totalAmount || 0, // Ensure number hai
                totalOrders: 1 
            } 
        }); 
    } else {
        // Agar koi aur status ho toh direct update karo
        order.orderStatus = status;
    }

    // Save changes
    await order.save();
    console.log("Order updated successfully in DB");
    
    // Redirect path match karo (kya ye /admin-newoder hai ya /admin/newoder?)
    res.redirect("admin/newoder"); 
    
  } catch (err) { 
    console.error("Status update error:", err);
    res.status(500).send("Status update failed: " + err.message); 
  }
};

// ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

exports.getAdminOrderHistory = async (req, res) => {
  try {
    if (!req.session.isLoggedIn || req.session.user.role !== "admin") return res.redirect("/login");
    const orders = await Order.find({ orderStatus: { $in: ["Delivered", "Cancelled"] } }).populate("user").populate("items.product").sort({ createdAt: -1 });
    res.render("Admin/admin-order-history", { orders, isLoggedIn: req.session.isLoggedIn, admin: req.session.user });
  } catch (err) { res.status(500).send("Failed to load order history"); }
};

exports.getTotalProductsCount = async (req, res) => {
  try {
    const filter = req.query.filter || "all";
    let query = {};
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "active" });
    const inactiveProducts = await Product.countDocuments({ status: "inactive" });
    const categoryStats = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    res.render("Admin/admin-total-products", { products, totalProducts, activeProducts, inactiveProducts, categoryStats, filter, isLoggedIn: req.session.isLoggedIn, admin: req.session.user });
  } catch (err) { res.status(500).send("Failed to load products"); }
};

exports.getTotalPendingOrdersCount = async (req, res) => {
  try {
    const orders = await Order.find({ "cancelled.isCancelled": false, orderStatus: { $in: ["Confirmed", "Shipped"] } })
      .populate("user", "username phoneNo emailAddress").populate("items.product", "title images").sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-pending-orders", { orders, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getCancelOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "cancelled.isCancelled": true, orderStatus: "Cancelled" })
      .populate("user", "username phoneNo emailAddress").populate("items.product", "title images").sort({ "cancelled.cancelledAt": -1 }).lean();
    res.render("Admin/admin-cancel-orders", { orders, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getTotalComplitedOrdersCount = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Delivered" }).populate("user", "username phoneNo emailAddress").populate("items.product", "title images price").sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-completed-orders", { orders, totalCompletedOrders: orders.length, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getTotalOrdersCount = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "username phoneNo emailAddress").populate("items.product", "title images price").sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-total-orders", { orders, totalOrders: orders.length, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getTodaysOrdersCount = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } }).populate("user").populate("items.product").sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-todays-orders", { orders, totalOrders: orders.length, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getYesterdayOrdersCount = async (req, res) => {
  try {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const start = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0);
    const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } }).populate("user").populate("items.product").sort({ createdAt: -1 }).lean();
    res.render("Admin/admin-yesterday-orders", { orders, totalOrders: orders.length, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getTodaySales = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0); const end = new Date(); end.setHours(23, 59, 59, 999);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end }, orderStatus: "Delivered" }).populate("user").populate("items.product").sort({ createdAt: -1 }).lean();
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.render("Admin/admin-today-sales", { orders, totalSales, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getYesterdaySales = async (req, res) => {
  try {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const start = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0);
    const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end }, orderStatus: "Delivered" }).populate("user").populate("items.product").sort({ createdAt: -1 }).lean();
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.render("Admin/admin-yesterday-sales", { orders, totalSales, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.getTotalSales = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Delivered" }).populate("user").populate("items.product").sort({ createdAt: -1 }).lean();
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.render("Admin/admin-total-sale", { orders, totalSales, admin: req.session.user, isLoggedIn: true });
  } catch (err) { res.status(500).send("Something went wrong"); }
};

exports.postAddCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const imageUrl = await uploadToPhpServer(req.file.path);
        const newCategory = new Category({ name: categoryName.trim(), imageUrl: imageUrl });
        await newCategory.save();
        res.redirect('/admin/category');
    } catch (err) { res.status(500).send("Error: " + err.message); }
};

exports.deleteCategory = async (req, res) => {
    try { await Category.findByIdAndDelete(req.params.id); res.redirect('/admin/category'); } catch (err) { res.status(500).send("Error deleting"); }
};

exports.getCategoryPage = async (req, res) => {
    try {
        const category = await Category.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, 'i') } });
        
        if (!category) {
            return res.status(404).send("Category not found");
        }

        // DEBUG: Check karein ki brands ka format kya hai
        console.log("DEBUG: Raw brands data from DB:", category.brands);

        // FIX: kyunki DB mein ID string format mein hai, 
        // humein category._id ko .toString() karna padega
        const products = await Product.find({ category: category._id.toString() }); 
        
        console.log("DEBUG: Looking for category ID (as string):", category._id.toString());
        console.log("DEBUG: Products found:", products.length);

        res.render('Admin/category-details', { 
            admin: req.session.admin || { username: 'Admin' }, 
            category, 
            categoryName: category.name, 
            products, 
            // Data ko safely pass karein
            brands: category.brands && Array.isArray(category.brands) ? category.brands : [], 
            sizes: category.sizes || [] 
        });
    } catch (err) { 
        console.error("CRITICAL ERROR:", err);
        res.status(500).send("Server Error: " + err.message); 
    }
};

exports.addBrandToCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, brandName } = req.body;

        // 1. Image upload handle karein
        let brandImageUrl = '';
        if (req.file) {
            // Aapka existing upload function call karein
            brandImageUrl = await uploadToPhpServer(req.file.path);
        } else {
            return res.status(400).send("Brand image is required.");
        }

        // 2. Naye schema ke hisaab se object push karein
        await Category.findByIdAndUpdate(categoryId, { 
            $push: { 
                brands: { 
                    name: brandName, 
                    image: brandImageUrl 
                } 
            } 
        });

        console.log("SUCCESS: Brand added successfully with image");
        
        // Redirect logic (spaces remove karke clean URL)
        const cleanCategoryName = categoryName.replace(/\s+/g, '');
        res.redirect(`/admin/category/${cleanCategoryName}`);

    } catch (err) { 
        console.error("ERROR adding brand:", err);
        res.status(500).send("Error adding brand: " + err.message); 
    }
};

exports.addSize = async (req, res) => {
    try {
        const { categoryId, sizeName } = req.body;
        await Category.findByIdAndUpdate(categoryId, { $addToSet: { sizes: sizeName } });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).send("Error"); }
};




exports.deleteSize = async (req, res) => {
    try {
        const { categoryId, sizeName } = req.body;
        await Category.findByIdAndUpdate(categoryId, { $pull: { sizes: sizeName } });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).send("Error"); }
};

exports.deleteBrand = async (req, res) => {
    try {
        const { categoryId, brandName } = req.body;
        
        // $pull ab name property ke basis par match karega
        await Category.findByIdAndUpdate(categoryId, { 
            $pull: { 
                brands: { name: brandName } 
            } 
        });
        
        console.log(`SUCCESS: Brand '${brandName}' deleted from category ${categoryId}`);
        res.status(200).json({ success: true });
        
    } catch (err) { 
        console.error("ERROR deleting brand:", err);
        res.status(500).json({ success: false, message: "Error deleting brand" }); 
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id; // URL se ID lo
        const { name, status, isGenderFilterEnabled } = req.body; // Baki data body se
        
        console.log("Received Data:", { categoryId, name, status, isGenderFilterEnabled });

        const filterStatus = (isGenderFilterEnabled === 'true');

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId, 
            {
                name,
                status,
                isGenderFilterEnabled: filterStatus
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).send("Category not found");
        }

       res.redirect(`/admin/category/${updatedCategory.name}`);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).send("Update failed: " + err.message);
    }
};