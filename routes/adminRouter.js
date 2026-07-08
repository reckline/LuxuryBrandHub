// // adminRouter.post(
// //   "/admin-howmanyglassesuploaded",
// //   upload.array("images", 4), // 👈 name="images"
// //   adminController.postAdminHowManyGlassesProductUploaded
// // );
// // adminRouter.post(
// //   "/admin-editglassesproducts",
// //   upload.array("images", 4), // 👈 same multer
// //   adminController.postAdminGlassesEditProducts
// // );

// const express = require('express');
// const adminRouter = express.Router();
// const router = express.Router(); 
// const adminController = require('../controller/adminController');



// //Admin Dashboard Routes
// adminRouter.get('/admin-home', adminController.getAdminHome);
// adminRouter.get('/admin-userlist', adminController.getAdminUsersList);
// adminRouter.get('/admin-seeuseralldetails/:id', adminController.getAdminSeeUserAllDetails);
// adminRouter.get('/admin-newoder', adminController.getAdminNewOrders);
// adminRouter.post('/admin-update-order-status', adminController.postAdminUpdateOrderStatus);
// adminRouter.get('/admin-order-history', adminController.getAdminOrderHistory);
// adminRouter.get('/totalproducts', adminController.getTotalProductsCount);
// adminRouter.get('/totalpendingorders', adminController.getTotalPendingOrdersCount);
// adminRouter.get('/cancel-orders', adminController.getCancelOrders);
// adminRouter.get('/totalcomplitedorders', adminController.getTotalComplitedOrdersCount);
// adminRouter.get('/totalorders', adminController.getTotalOrdersCount);
// adminRouter.get('/todaysorders', adminController.getTodaysOrdersCount);
// adminRouter.get('/yesterdayorders', adminController.getYesterdayOrdersCount);
// adminRouter.get('/total-sales', adminController.getTotalSales);
// adminRouter.get('/todaysale', adminController.getTodaySales);
// adminRouter.get('/yesterdaysale', adminController.getYesterdaySales);




// //Upload Products Routes
// adminRouter.get('/admin-howmanyshoesuploaded', adminController.getAdminHowManyShoesUploaded);

// const upload = require("../utils/multer");

// adminRouter.post(
//   "/admin-howmanyshoesuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyShoesProductUploaded
// );


// adminRouter.post(
//   "/admin-editshoesproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminShoesEditProducts
// );

// adminRouter.get('/admin-howmanyglassesuploaded', adminController.getAdminHowManyGlassesUploaded);
// adminRouter.post(
//   "/admin-howmanyglassesuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyGlassesProductUploaded
// );


// adminRouter.post(
//   "/admin-editglassesproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminGlassesEditProducts
// );


// adminRouter.get('/admin-howmanywatchesuploaded', adminController.getAdminHowManyWatchesUploaded);
// adminRouter.post(
//   "/admin-howmanywatchesuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyWatchesUploaded
// );

// adminRouter.post(
//   "/admin-editwatchesproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminWatchesEditProducts
// );


// adminRouter.get('/admin-howmanyclothesuploaded', adminController.getAdminHowManyClothesUploaded);
// adminRouter.post(
//   "/admin-howmanyclothesuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyClothesUploaded
// );

// adminRouter.post(
//   "/admin-editclothesproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminClothesEditProducts
// );

// adminRouter.get('/admin-howmanybagsuploaded', adminController.getAdminHowManyBagsUploaded);
// adminRouter.post(
//   "/admin-howmanybagsuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyBagsUploaded
// );

// adminRouter.post(
//   "/admin-editbagsproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminBagsEditProducts
// );


// //crocs
// adminRouter.get('/admin-howmanycrocsuploaded', adminController.getAdminHowManyCrocsUploaded);
// adminRouter.post(
//   "/admin-howmanycrocsuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManyCrocsUploaded
// );

// adminRouter.post(
//   "/admin-editcrocsproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminCrocsEditProducts
// );

// //sliders
// adminRouter.get('/admin-howmanyslidersuploaded', adminController.getAdminHowManySlidersUploaded);

// adminRouter.post(
//   "/admin-howmanyslidersuploaded",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminHowManySlidersUploaded
// );

// adminRouter.post(
//   "/admin-editsliderslproducts",
//   (req, res, next) => {
//     upload.array("images", 4)(req, res, function (err) {
//       if (err) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(400).send("Each image must be under 2MB");
//         }
//         if (err.code === "LIMIT_FILE_COUNT") {
//           return res.status(400).send("Maximum 4 images allowed");
//         }
//         return res.status(400).send(err.message);
//       }
//       next();
//     });
//   },
//   adminController.postAdminSlidersEditProducts
// );


// module.exports = adminRouter;
 

const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const upload = require("../utils/multer");

//Admin Dashboard Routes
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
adminRouter.get('/admin-category', adminController.getAdminCategory);
adminRouter.post('/admin/delete-category/:id', adminController.deleteCategory);
adminRouter.get('/admin/category/:name', adminController.getCategoryPage);
adminRouter.post('/admin/add-brand', adminController.addBrandToCategory);
adminRouter.post('/admin/delete-brand', adminController.deleteBrand);
adminRouter.get('/admin/category/:categoryName', adminController.getCategoryProducts);
adminRouter.post('/admin-add-size', adminController.addSize);
adminRouter.post('/admin-delete-size', adminController.deleteSize);

// Form submit karne ke liye
adminRouter.post(
    '/admin/add-category', 
    upload.single('categoryImage'), 
    adminController.postAddCategory
);

//Upload Products Routes
adminRouter.get('/admin-howmanyshoesuploaded', adminController.getAdminHowManyShoesUploaded);

adminRouter.post(
  "/admin-howmanyshoesuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyShoesProductUploaded
);

adminRouter.post(
  "/admin-editshoesproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminShoesEditProducts
);

adminRouter.get('/admin-howmanyglassesuploaded', adminController.getAdminHowManyGlassesUploaded);
adminRouter.post(
  "/admin-howmanyglassesuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyGlassesProductUploaded
);

adminRouter.post(
  "/admin-editglassesproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminGlassesEditProducts
);

adminRouter.get('/admin-howmanywatchesuploaded', adminController.getAdminHowManyWatchesUploaded);
adminRouter.post(
  "/admin-howmanywatchesuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyWatchesUploaded
);

adminRouter.post(
  "/admin-editwatchesproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminWatchesEditProducts
);

adminRouter.get('/admin-howmanyclothesuploaded', adminController.getAdminHowManyClothesUploaded);
adminRouter.post(
  "/admin-howmanyclothesuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyClothesUploaded
);

adminRouter.post(
  "/admin-editclothesproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminClothesEditProducts
);

adminRouter.get('/admin-howmanybagsuploaded', adminController.getAdminHowManyBagsUploaded);
adminRouter.post(
  "/admin-howmanybagsuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyBagsUploaded
);

adminRouter.post(
  "/admin-editbagsproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminBagsEditProducts
);

adminRouter.get('/admin-howmanycrocsuploaded', adminController.getAdminHowManyCrocsUploaded);
adminRouter.post(
  "/admin-howmanycrocsuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManyCrocsUploaded
);

adminRouter.post(
  "/admin-editcrocsproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminCrocsEditProducts
);

adminRouter.get('/admin-howmanyslidersuploaded', adminController.getAdminHowManySlidersUploaded);
adminRouter.post(
  "/admin-howmanyslidersuploaded",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminHowManySlidersUploaded
);

adminRouter.post(
  "/admin-editsliderslproducts",
  (req, res, next) => {
    upload.array("images", 4)(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Each image must be under 2MB");
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).send("Maximum 4 images allowed");
        }
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  adminController.postAdminSlidersEditProducts
);

module.exports = adminRouter;