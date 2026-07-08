
// const User = require("../model/userSchema");
// const Product = require("../model/productSchema");
// const Order = require("../model/orderSchema");
// const uploadToPhpServer = require("../utils/uploadToPhpServer");
// const Category = require('../model/categorySchema');

// exports.getAdminHome = async (req, res, next) => {
//   try {
//     // 1️⃣ Login check
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return res.redirect("/login");
//     }

//     // 2️⃣ Role check (ONLY ADMIN)
//     if (req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // 3️⃣ Fetch ALL users with role = "user"
//     const users = await User.find({ role: "user" }).sort({
//       createdAt: -1,
//     });

//     // 4️⃣ Render admin page OR send data
//     res.render("Admin/adminHome", {
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user,
//       users: users,
//     });

//     // 🔁 OR (agar API banana hai)
//     // res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };


// // Admin Categories View - Data fetch karne ke liye
// exports.getAdminCategory = async (req, res) => {
//     try {
//         const categories = await Category.find({}).lean();
//         console.log("DEBUG: Category list length:", categories.length); 
        
//         res.render('Admin/admin-category', { 
//             admin: req.session.admin || { username: 'Admin' }, 
//             categories: categories 
//         });
//     } catch (err) {
//         console.error("Error in getAdminCategory:", err);
//         res.status(500).send("Error loading categories");
//     }
// };


// exports.getAdminUsersList = async (req, res, next) => {
//   try {
//     // 1️⃣ Login check
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return res.redirect("/login");
//     }

//     // 2️⃣ Role check (ONLY ADMIN)
//     if (req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // 3️⃣ Fetch ALL users with role = "user"
//     const users = await User.find({ role: "user" }).sort({
//       createdAt: -1,
//     });

//     // 4️⃣ Render admin page OR send data
//     res.render("Admin/userList", {
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user,
//       users: users,
//     });

//     // 🔁 OR (agar API banana hai)
//     // res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getAdminHowManyShoesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + LOGIN CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔒 ROLE CHECK
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // ✅ DYNAMIC CATEGORY: URL params ya query se category uthayein
//     // Maan lijiye aapka URL aisa hai: /admin/products/:categoryName
//     const categoryName = req.params.categoryName || "shoes"; 

//     // 🔍 FETCH PRODUCTS: Ab yahan static "shoes" ki jagah dynamic category use hogi
//     const products = await Product.find({ category: categoryName }).sort({ createdAt: -1 });
    
//     // category object bhi fetch karein taaki frontend mein naam dikh sake
//     const category = await Category.findOne({ name: categoryName });

//     // 🖥 RENDER
//     res.render("Admin/adminAllShoesProducts", {
//       admin,
//       products,
//       category: category || { name: categoryName }, // Agar category database mein na mile toh fallback
//       selectedFilter: req.query.filter || "all",
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Get Shoes Error:", err);
//     res.status(500).send("Server Error");
//   }
// };
// exports.postAdminHowManyShoesProductUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // 🔍 Capture filter
//     const filterFromForm = req.body.filter || "all";

//     // 🛑 DEBUGGING: Terminal mein check karein ki kya category aa rahi hai
//     console.log("Incoming Body Data:", req.body); 

//     const {
//       title,
//       price,
//       description,
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       sizes,
//       category,
//     } = req.body;

//     // VALIDATION: Agar category missing hai toh error bhejain
//     if (!category) {
//         throw new Error("Category is missing from the form!");
//     }

//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // 🚀 UPLOAD TO PHP SERVER
//     let imageUrls = [];
//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 📦 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       price,
//       description,
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       brand,
//       category, // Yahan 'category' string ya ID jo aapne bheja hai, wo save hoga
//       sizes: sizeArray,
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Product added successfully to category:", category);
    
//     // 🔄 REDIRECT WITH FILTER
//     res.redirect(`/admin-howmanyshoesuploaded?filter=${filterFromForm}`);
//   } catch (err) {
//     // ❌ Yahan detail mein error print hoga, ise terminal mein check karein
//     console.error("❌ Add Product Error Details:", err.message);
//     res.status(500).send("Something went wrong: " + err.message);
//   }
// };
// exports.postAdminShoesEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       status,
//       sizes,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // 👟 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.price = price;
//     product.description = description; // 👈 UPDATE
//     product.offerPercentage = offerPercentage || 0;
//     product.totalStock = totalStock;
//     product.gender = gender;
//     product.brand = brand;
//     product.status = status;
//     product.sizes = sizeArray;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images automatically

//     await product.save(); // offerPrice auto recalculated

//     console.log("✅ Shoes updated (PHP Upload):", product.title);

//     return res.redirect("/admin-howmanyshoesuploaded");
//   } catch (err) {
//     console.error("❌ Edit Shoe Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManyGlassesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 ADMIN SESSION CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔍 FILTER FROM QUERY
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "glasses" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     }

//     if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     res.render("Admin/adminAllGlassesProducts", {
//       admin,
//       products,
//       selectedFilter: filter, // 👈 for select box
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Glasses GET Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManyGlassesProductUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       category,
//     } = req.body;

//     // ✅ SAFE OFFER VALUE
//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // ☁ CLOUDINARY UPLOAD
//     let imageUrls = [];

//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       category, // "glasses"
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Glasses added successfully");
//     res.redirect("/admin-howmanyglassesuploaded");
//   } catch (err) {
//     console.error("❌ Add Glasses Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminGlassesEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       status,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.price = price;
//     product.offerPercentage = offerPercentage || 0;
//     product.description = description; // 👈 UPDATE
//     product.totalStock = totalStock;
//     product.gender = gender;
//     product.status = status;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images

//     await product.save();

//     console.log("✅ Glasses updated:", product.title);

//     return res.redirect("/admin-howmanyglassesuploaded");
//   } catch (err) {
//     console.error("❌ Edit Glasses Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManyWatchesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 ADMIN SESSION CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔍 FILTER FROM QUERY (?filter=show | hide | all)
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "watch" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     }

//     if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     res.render("Admin/adminAllWatchesProducts", {
//       admin,
//       products,
//       selectedFilter: filter, // 👈 select box ke liye
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Watches GET Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManyWatchesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       category, // "watch"
//     } = req.body;

//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // 🚀 UPLOAD TO PHP SERVER
//     let imageUrls = [];
//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       brand: brand || null,
//       category, // "watch"
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Watch added successfully");
//     res.redirect("/admin-howmanywatchesuploaded");
//   } catch (err) {
//     console.error("❌ Add Watch Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminWatchesEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       status,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.price = price;
//     product.description = description; // 👈 UPDATE
//     product.offerPercentage = offerPercentage || 0;
//     product.totalStock = totalStock;
//     product.gender = gender;
//     product.brand = brand || null;
//     product.status = status;

//     // 🖼 IMAGE UPDATE (OPTIONAL – PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → old images remain unchanged

//     await product.save(); // offerPrice auto recalculated

//     console.log("✅ Watch updated:", product.title);

//     return res.redirect("/admin-howmanywatchesuploaded");
//   } catch (err) {
//     console.error("❌ Edit Watch Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManyClothesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + LOGIN CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔒 ROLE CHECK (important)
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // 🔍 FILTER FROM QUERY
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "clothes" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     } else if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     // 📦 FETCH PRODUCTS
//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     // 🖥 RENDER
//     res.render("Admin/adminAllClothesProducts", {
//       admin,
//       products,
//       selectedFilter: filter,
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Get Shoes Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManyClothesUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       description, // 👈 SAVE
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       sizes,
//       category,
//     } = req.body;

//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // 🚀 UPLOAD TO PHP SERVER
//     let imageUrls = [];

//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 📦 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       brand,
//       category,
//       sizes: sizeArray,
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Clothes added (PHP Upload)");
//     res.redirect("/admin-howmanyclothesuploaded");
//   } catch (err) {
//     console.error("❌ Add Clothes Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminClothesEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       brand,
//       status,
//       sizes,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // 👟 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.description = description; // 👈 UPDATE
//     product.price = price;
//     product.offerPercentage = offerPercentage || 0;
//     product.totalStock = totalStock;
//     product.gender = gender;
//     product.brand = brand;
//     product.status = status;
//     product.sizes = sizeArray;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images automatically

//     await product.save(); // offerPrice auto recalculated

//     console.log("✅ Clothes updated (PHP Upload):", product.title);

//     return res.redirect("/admin-howmanyclothesuploaded");
//   } catch (err) {
//     console.error("❌ Edit Clothes Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManyBagsUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + LOGIN CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔒 ROLE CHECK (important)
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // 🔍 FILTER FROM QUERY
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "bags" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     } else if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     // 📦 FETCH PRODUCTS
//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     // 🖥 RENDER
//     res.render("Admin/adminAllBagsProducts", {
//       admin,
//       products,
//       selectedFilter: filter,
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Get Bags Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManyBagsUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       category,
//     } = req.body;

//     // ✅ SAFE OFFER VALUE
//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // ☁ CLOUDINARY UPLOAD
//     let imageUrls = [];

//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       category, // "bags"
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Bags added successfully");
//     res.redirect("/admin-howmanybagsuploaded");
//   } catch (err) {
//     console.error("❌ Add Bags Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminBagsEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       price,
//       description, // 👈 ADD
//       offerPercentage,
//       totalStock,
//       gender,
//       status,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.price = price;
//     product.offerPercentage = offerPercentage || 0;
//     product.description = description; // 👈 UPDATE
//     product.totalStock = totalStock;
//     product.gender = gender;
//     product.status = status;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images

//     await product.save();

//     console.log("✅ Bags updated:", product.title);

//     return res.redirect("/admin-howmanybagsuploaded");
//   } catch (err) {
//     console.error("❌ Edit Bags Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManyCrocsUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + LOGIN CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔒 ROLE CHECK (important)
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // 🔍 FILTER FROM QUERY
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "crocs" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     } else if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     // 📦 FETCH PRODUCTS
//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     // 🖥 RENDER
//     res.render("Admin/adminAllCrocsProducts", {
//       admin,
//       products,
//       selectedFilter: filter,
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Get Crocs Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManyCrocsUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       description, // 👈 SAVE
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       // brand,
//       sizes,
//       category,
//     } = req.body;

//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // 🚀 UPLOAD TO PHP SERVER
//     let imageUrls = [];

//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 📦 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       // brand,
//       category,
//       sizes: sizeArray,
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Crocs added (PHP Upload)");
//     res.redirect("/admin-howmanycrocsuploaded");
//   } catch (err) {
//     console.error("❌ Add Crocs Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminCrocsEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       // brand,
//       status,
//       sizes,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // 👟 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.description = description; // 👈 UPDATE
//     product.price = price;
//     product.offerPercentage = offerPercentage || 0;
//     product.totalStock = totalStock;
//     product.gender = gender;
//     // product.brand = brand;
//     product.status = status;
//     product.sizes = sizeArray;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images automatically

//     await product.save(); // offerPrice auto recalculated

//     console.log("✅ Crocs updated (PHP Upload):", product.title);

//     return res.redirect("/admin-howmanycrocsuploaded");
//   } catch (err) {
//     console.error("❌ Edit Crocs Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// exports.getAdminHowManySlidersUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + LOGIN CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;

//     // 🔒 ROLE CHECK (important)
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     // 🔍 FILTER FROM QUERY
//     const filter = req.query.filter || "all";

//     let findQuery = { category: "sliders" };

//     if (filter === "show") {
//       findQuery.status = "active";
//     } else if (filter === "hide") {
//       findQuery.status = "inactive";
//     }

//     // 📦 FETCH PRODUCTS
//     const products = await Product.find(findQuery).sort({ createdAt: -1 });

//     // 🖥 RENDER
//     res.render("Admin/adminAllSlidersProducts", {
//       admin,
//       products,
//       selectedFilter: filter,
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("❌ Get Crocs Error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// exports.postAdminHowManySlidersUploaded = async (req, res, next) => {
//   try {
//     // 🔐 SESSION + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     const admin = req.session.user;
//     if (admin.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       title,
//       description, // 👈 SAVE
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       // brand,
//       sizes,
//       category,
//     } = req.body;

//     const offer = Number(offerPercentage) || 0;

//     // 🖼 IMAGE VALIDATION
//     if (!req.files || req.files.length < 1) {
//       return res.status(400).send("Minimum 1 image required");
//     }

//     // 🚀 UPLOAD TO PHP SERVER
//     let imageUrls = [];

//     for (let file of req.files) {
//       const url = await uploadToPhpServer(file.path);
//       imageUrls.push(url);
//     }

//     // 📦 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // 🧠 CREATE PRODUCT
//     const product = new Product({
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage: offer,
//       totalStock,
//       gender,
//       // brand,
//       category,
//       sizes: sizeArray,
//       images: imageUrls,
//       createdBy: admin._id,
//     });

//     await product.save();

//     console.log("✅ Sliders added (PHP Upload)");
//     res.redirect("/admin-howmanyslidersuploaded");
//   } catch (err) {
//     console.error("❌ Add Sliders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.postAdminSlidersEditProducts = async (req, res, next) => {
//   try {
//     // 🔐 LOGIN + ROLE CHECK
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return req.session.destroy(() => res.redirect("/login"));
//     }

//     if (req.session.user.role !== "admin") {
//       return res.status(403).redirect("/login");
//     }

//     const {
//       productId,
//       title,
//       description, // 👈 ADD
//       price,
//       offerPercentage,
//       totalStock,
//       gender,
//       // brand,
//       status,
//       sizes,
//     } = req.body;

//     // 🧠 FIND PRODUCT
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // 👟 SIZES FIX
//     let sizeArray = [];
//     if (Array.isArray(sizes)) {
//       sizeArray = sizes.map(String);
//     } else if (sizes) {
//       sizeArray = [String(sizes)];
//     }

//     // ✏ UPDATE BASIC FIELDS
//     product.title = title;
//     product.description = description; // 👈 UPDATE
//     product.price = price;
//     product.offerPercentage = offerPercentage || 0;
//     product.totalStock = totalStock;
//     product.gender = gender;
//     // product.brand = brand;
//     product.status = status;
//     product.sizes = sizeArray;

//     // 🖼 IMAGE UPDATE (OPTIONAL PHP UPLOAD)
//     if (req.files && req.files.length > 0) {
//       let imageUrls = [];

//       for (let file of req.files) {
//         const url = await uploadToPhpServer(file.path);
//         imageUrls.push(url);
//       }

//       product.images = imageUrls; // 🔥 replace old images
//     }
//     // else → keep old images automatically

//     await product.save(); // offerPrice auto recalculated

//     console.log("✅ Sliders updated (PHP Upload):", product.title);

//     return res.redirect("/admin-howmanyslidersuploaded");
//   } catch (err) {
//     console.error("❌ Edit Sliders Error:", err);
//     res.status(500).send("Update failed");
//   }
// };

// // GET /admin-seeuseralldetails/:id
// exports.getAdminSeeUserAllDetails = async (req, res, next) => {
//   try {
//     // 🔐 Security check: logged in?
//     if (!req.session.isLoggedIn || !req.session.user) {
//       return res.redirect("/login");
//     }

//     // 🔐 Security check: only admin can access
//     if (req.session.user.role !== "admin") {
//       return res.status(403).send("Access denied. Admins only.");
//     }

//     const userId = req.params.id;

//     // ✅ Fetch the user
//     const user = await User.findById(userId).lean();
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // ✅ Fetch the user's orders, sorted by latest first
//     const orders = await Order.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     // ✅ FIXED: Render the admin page with the full 'user' object as 'admin'
//     // Taki adminTop.ejs mein 'admin.username' sahi se access ho sake
//     res.render("Admin/admin-seeuseralldetails", {
//       user,
//       orders,
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user, // Yahan 'req.session.user' bhejna zaroori hai
//     });
//   } catch (err) {
//     console.error("Error fetching user details:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getAdminNewOrders = async (req, res) => {
//   try {
//     // 🔐 security
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const orders = await Order.find({
//       orderStatus: { $nin: ["Delivered", "Cancelled"] },
//     })
//       .populate("user")
//       .populate("items.product") // 🔥 THIS IS THE FIX
//       .sort({ createdAt: -1 });

//     res.render("Admin/admin-neworder", {
//       orders,
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error loading orders");
//   }
// };

// exports.postAdminUpdateOrderStatus = async (req, res) => {
//   try {
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const { orderId, status } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.redirect("/admin-newoder");

//     // If admin cancels
//     if (status === "Cancelled") {
//       order.orderStatus = "Cancelled";
//       order.cancelled.isCancelled = true;
//       order.cancelled.cancelledAt = new Date();
//       order.cancelled.cancelledBy = "admin";
//       order.cancelled.cancelReason = "Cancelled by admin";
//     }

//     // If delivered
//     if (status === "Delivered") {
//       order.orderStatus = "Delivered";
//       order.paymentStatus = "Paid";
//     }

//     await order.save();

//     // 🔥 Update user's stats if delivered
//     if (status === "Delivered") {
//       await User.findByIdAndUpdate(order.user, {
//         $inc: {
//           totalSpend: order.totalAmount,
//           totalOrders: 1,
//         },
//       });
//     }

//     res.redirect("/admin-newoder");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Status update failed");
//   }
// };

// exports.getAdminOrderHistory = async (req, res) => {
//   try {
//     // 🔐 Only admin allowed
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const orders = await Order.find({
//       orderStatus: { $in: ["Delivered", "Cancelled"] },
//     })
//       .populate("user")
//       .populate("items.product")
//       .sort({ createdAt: -1 });

//     res.render("Admin/admin-order-history", {
//       orders,
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Failed to load order history");
//   }
// };

// exports.getTotalProductsCount = async (req, res) => {
//   try {
//     // 🔐 Admin only
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const filter = req.query.filter || "all";

//     let query = {};
//     if (filter === "active") query.status = "active";
//     if (filter === "inactive") query.status = "inactive";

//     // Fetch products
//     const products = await Product.find(query).sort({ createdAt: -1 }).lean();

//     // Stats
//     const totalProducts = await Product.countDocuments();
//     const activeProducts = await Product.countDocuments({ status: "active" });
//     const inactiveProducts = await Product.countDocuments({
//       status: "inactive",
//     });

//     // Category wise
//     const categoryStats = await Product.aggregate([
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//     ]);

//     res.render("Admin/admin-total-products", {
//       products,
//       totalProducts,
//       activeProducts,
//       inactiveProducts,
//       categoryStats,
//       filter,
//       isLoggedIn: req.session.isLoggedIn,
//       admin: req.session.user,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to load products");
//   }
// };

// exports.getTotalPendingOrdersCount = async (req, res) => {
//   try {
//     // 🔐 Admin Security
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // Pending = Confirmed OR Shipped (but not delivered & not cancelled)
//     const orders = await Order.find({
//       "cancelled.isCancelled": false,
//       orderStatus: { $in: ["Confirmed", "Shipped"] },
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.render("Admin/admin-pending-orders", {
//       orders,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Pending Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getCancelOrders = async (req, res) => {
//   try {
//     // 🔐 Admin security
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const orders = await Order.find({
//       "cancelled.isCancelled": true,
//       orderStatus: "Cancelled",
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images")
//       .sort({ "cancelled.cancelledAt": -1 })
//       .lean();

//     res.render("Admin/admin-cancel-orders", {
//       orders,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Cancelled Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getTotalComplitedOrdersCount = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // Find completed orders → Delivered
//     const orders = await Order.find({ orderStatus: "Delivered" })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     const totalCompletedOrders = orders.length;

//     res.render("Admin/admin-completed-orders", {
//       orders,
//       totalCompletedOrders,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Completed Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getTotalOrdersCount = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const orders = await Order.find({})
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     const totalOrders = orders.length;

//     res.render("Admin/admin-total-orders", {
//       orders,
//       totalOrders,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Total Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getTodaysOrdersCount = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const start = new Date();
//     start.setHours(0, 0, 0, 0); // Today start

//     const end = new Date();
//     end.setHours(23, 59, 59, 999); // Today end

//     // Fetch today's orders
//     const orders = await Order.find({
//       createdAt: { $gte: start, $lte: end },
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     const totalOrders = orders.length;

//     res.render("Admin/admin-todays-orders", {
//       orders,
//       totalOrders,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Todays Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getYesterdayOrdersCount = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // Get yesterday's date range
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const startOfYesterday = new Date(
//       yesterday.getFullYear(),
//       yesterday.getMonth(),
//       yesterday.getDate(),
//       0,
//       0,
//       0
//     );

//     const endOfYesterday = new Date(
//       yesterday.getFullYear(),
//       yesterday.getMonth(),
//       yesterday.getDate(),
//       23,
//       59,
//       59
//     );

//     // Fetch orders created yesterday
//     const orders = await Order.find({
//       createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     const totalOrders = orders.length;

//     res.render("Admin/admin-yesterday-orders", {
//       orders,
//       totalOrders,
//       admin: req.session.user,
//       isLoggedIn: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.error("Yesterday Orders Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getTodaySales = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const today = new Date();
//     const startOfToday = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate(),
//       0,
//       0,
//       0
//     );
//     const endOfToday = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate(),
//       23,
//       59,
//       59
//     );

//     // Fetch today's orders
//     const orders = await Order.find({
//       createdAt: { $gte: startOfToday, $lte: endOfToday },
//       orderStatus: "Delivered", // Only include delivered orders
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     // Calculate total sales
//     const totalSales = orders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );

//     res.render("Admin/admin-today-sales", {
//       orders,
//       totalSales,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Today Sales Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getYesterdaySales = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     const today = new Date();
//     const startOfYesterday = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate() - 1,
//       0,
//       0,
//       0
//     );
//     const endOfYesterday = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate() - 1,
//       23,
//       59,
//       59
//     );

//     // Fetch yesterday's orders (excluding cancelled)
//     const orders = await Order.find({
//       createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
//       orderStatus: "Delivered",
//     })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     // Calculate total sales
//     const totalSales = orders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );

//     res.render("Admin/admin-yesterday-sales", {
//       orders,
//       totalSales,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Yesterday Sales Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };

// exports.getTotalSales = async (req, res) => {
//   try {
//     // 🔐 Admin check
//     if (!req.session.isLoggedIn || req.session.user.role !== "admin") {
//       return res.redirect("/login");
//     }

//     // Get all orders except cancelled
//     const orders = await Order.find({ orderStatus: "Delivered" })
//       .populate("user", "username phoneNo emailAddress")
//       .populate("items.product", "title images price")
//       .sort({ createdAt: -1 })
//       .lean();

//     // Total sales amount
//     const totalSales = orders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );

//     res.render("Admin/admin-total-sale", {
//       orders,
//       totalSales,
//       admin: req.session.user,
//       isLoggedIn: true,
//     });
//   } catch (err) {
//     console.error("Total Sales Error:", err);
//     res.status(500).send("Something went wrong");
//   }
// };



// // Add Category logic - Data save karne ke liye
// // Add Category logic - Updated for PHP Upload
// exports.postAddCategory = async (req, res) => {
//     try {
//         const { categoryName } = req.body;
        
//         if (!categoryName) {
//             return res.status(400).send("Category name is required.");
//         }
        
//         if (!req.file) {
//             return res.status(400).send("Category image is required.");
//         }

//         // ✅ FIXED: PHP Server par upload karein aur URL prapt karein
//         // req.file.path aapki local temporary file ka path hai
//         const imageUrl = await uploadToPhpServer(req.file.path);
        
//         console.log("DEBUG: PHP Server returned URL:", imageUrl);

//         // Duplicate check
//         const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
//         if (existingCategory) {
//             return res.status(400).send("Category already exists!");
//         }

//         // Create and Save
//         const newCategory = new Category({
//             name: categoryName.trim(), 
//             imageUrl: imageUrl // Yahan ab https://24carret.in/... wala link save hoga
//         });
        
//         await newCategory.save();
        
//         console.log("SUCCESS: Category saved with URL:", imageUrl);
        
//         res.redirect('/admin-category');

//     } catch (err) {
//         console.error("SAVE ERROR:", err);
//         res.status(500).send("Internal Server Error: " + err.message);
//     }
// };


// exports.deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Category.findByIdAndDelete(id);
//         console.log("SUCCESS: Category deleted:", id);
//         res.redirect('/admin-category');
//     } catch (err) {
//         console.error("DELETE ERROR:", err);
//         res.status(500).send("Error deleting category");
//     }
// };

// exports.getCategoryPage = async (req, res) => {
//     try {
//         const categoryName = req.params.name;
        
//         // 1. Category find karein (Case-insensitive)
//         const category = await Category.findOne({ 
//             name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
//         });

//         if (!category) {
//             return res.status(404).send("Category not found");
//         }

//         // 2. Us category se related products fetch karein
//         const products = await Product.find({ 
//             category: { $regex: new RegExp(`^${category.name}$`, 'i') } 
//         });

//         // 3. Render ke saath category, products, brands, aur sizes pass karein
//         res.render('Admin/category-details', { 
//             admin: req.session.admin || { username: 'Admin' },
//             category: category,
//             products: products,
//             brands: category.brands || [], // Brands pass kiye
//             sizes: category.sizes || []   // Sizes pass kiye taaki error khatam ho jaye
//         });
//     } catch (err) {
//         console.error("Error loading category page:", err);
//         res.status(500).send("Server Error");
//     }
// };


// exports.addBrandToCategory = async (req, res) => {
//     try {
//         const { categoryId, categoryName, brandName } = req.body;
        
//         // Database mein brand push karein
//         await Category.findByIdAndUpdate(categoryId, { 
//             $push: { brands: brandName } 
//         });

//         console.log(`Brand '${brandName}' added to ${categoryName}`);
        
//         // Wapas usi category page par redirect karein
//         res.redirect(`/admin/category/${categoryName}`);
//     } catch (err) {
//         console.error("Error adding brand:", err);
//         res.status(500).send("Internal Server Error");
//     }
// };


// exports.getCategoryProducts = async (req, res) => {
//     const category = req.params.categoryName; // e.g., 'shoes', 'shirts', 'watches'
//     const products = await Product.find({ category: category }).sort({ createdAt: -1 });

//     res.render("Admin/categoryProducts", {
//         products,
//         categoryName: category,
//         admin: req.session.user
//     });
// };


// exports.addSize = async (req, res) => {
//     try {
//         const { categoryId, sizeName } = req.body;

//         // Validation: Check karein ki input khali toh nahi
//         if (!sizeName) return res.status(400).send("Size name is required");

//         // Category mein size push karein
//         const updatedCategory = await Category.findByIdAndUpdate(
//             categoryId,
//             { $addToSet: { sizes: sizeName } }, // $addToSet duplicate entry rokta hai
//             { new: true }
//         );

//         if (!updatedCategory) return res.status(404).send("Category not found");

//         res.status(200).json({ success: true, message: "Size added!" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// };


// exports.deleteSize = async (req, res) => {
//     try {
//         const { categoryId, sizeName } = req.body;
//         // $pull operator array se specific item nikal deta hai
//         await Category.findByIdAndUpdate(categoryId, { 
//             $pull: { sizes: sizeName } 
//         });
//         res.status(200).json({ success: true });
//     } catch (err) {
//         res.status(500).send("Server Error");
//     }
// };

// exports.deleteBrand = async (req, res) => {
//     try {
//         const { categoryId, brandName } = req.body;
        
//         await Category.findByIdAndUpdate(categoryId, { 
//             $pull: { brands: brandName } 
//         });
        
//         res.status(200).json({ success: true });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false });
//     }
// };







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
    const order = await Order.findById(orderId);
    if (status === "Cancelled") { order.orderStatus = "Cancelled"; order.cancelled = { isCancelled: true, cancelledAt: new Date(), cancelledBy: "admin" }; }
    if (status === "Delivered") { order.orderStatus = "Delivered"; order.paymentStatus = "Paid"; await User.findByIdAndUpdate(order.user, { $inc: { totalSpend: order.totalAmount, totalOrders: 1 } }); }
    await order.save();
    res.redirect("/admin-newoder");
  } catch (err) { res.status(500).send("Status update failed"); }
};

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
        res.redirect('/admin-category');
    } catch (err) { res.status(500).send("Error: " + err.message); }
};

exports.deleteCategory = async (req, res) => {
    try { await Category.findByIdAndDelete(req.params.id); res.redirect('/admin-category'); } catch (err) { res.status(500).send("Error deleting"); }
};

exports.getCategoryPage = async (req, res) => {
    try {
        const category = await Category.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, 'i') } });
        
        if (!category) {
            return res.status(404).send("Category not found");
        }

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
            brands: category.brands || [], 
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
        await Category.findByIdAndUpdate(categoryId, { $push: { brands: brandName } });
        res.redirect(`/admin/category/${categoryName}`);
    } catch (err) { res.status(500).send("Error"); }
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
        await Category.findByIdAndUpdate(categoryId, { $pull: { brands: brandName } });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};