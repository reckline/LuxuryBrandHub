const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../model/userSchema");

exports.getLogout = (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user) {
    return res.redirect("/login");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return next(err);
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

exports.getLogin = (req, res, next) => {
  try {
    res.render("login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: [],
      oldInput: {
        login: "",
        password: "",
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = [
  check("login").trim().notEmpty().withMessage("Username or Phone number is required"),
  check("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    const errors = validationResult(req);
    const { login, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: errors.array().map((e) => e.msg),
        oldInput: { login, password },
      });
    }

    try {
      const user = await User.findOne({
        $or: [{ username: login }, { phoneNo: login }],
      });

      if (!user) {
        return res.status(400).render("login", {
          pageTitle: "Login",
          isLoggedIn: false,
          errors: ["Invalid username / phone number or password"],
          oldInput: { login, password },
        });
      }

      if (user.userStatus === "suspended") {
        return res.status(403).render("login", {
          pageTitle: "Login",
          isLoggedIn: false,
          errors: ["Your account is suspended. Contact admin."],
          oldInput: { login, password },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).render("login", {
          pageTitle: "Login",
          isLoggedIn: false,
          errors: ["Invalid username / phone number or password"],
          oldInput: { login, password },
        });
      }

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
        profilePhoto: user.profilePhoto,
      };

      if (user.role === "admin") {
        req.session.admin = {
            _id: user._id.toString(),
            username: user.username,
            role: user.role
        };
      }

      await req.session.save();

      // FIXED: Redirect logic strictly pointing to the new /admin/ structure
      if (user.role === "admin") {
        return res.redirect("/admin/home");
      }

      return res.redirect("/");
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).render("login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: ["Something went wrong. Please try again."],
        oldInput: { login, password },
      });
    }
  },
];

exports.getSignup = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      return res.redirect("/");
    }
    res.render("signup", {
      errors: [],
      oldInput: { username: "", phoneNo: "", emailAddress: "", password: "" },
      isLoggedIn: false,
    });
  } catch (err) {
    next(err);
  }
};

exports.postSignup = [
  check("username").trim().notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long").custom(async (value) => {
    const user = await User.findOne({ username: value });
    if (user) throw new Error("Username already in use");
    return true;
  }),
  check("phoneNo").trim().notEmpty().withMessage("Phone number is required").custom(async (value) => {
    const user = await User.findOne({ phoneNo: value });
    if (user) throw new Error("Phone number already in use");
    return true;
  }),
  check("emailAddress").trim().isEmail().withMessage("Enter a valid email address").custom(async (value) => {
    const user = await User.findOne({ emailAddress: value });
    if (user) throw new Error("Email already in use");
    return true;
  }),
  check("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  check("confirmPassword").notEmpty().withMessage("Confirm Password is required").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { username, phoneNo, emailAddress, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        isLoggedIn: false,
        errors: errors.array().map((e) => e.msg),
        oldInput: { username, phoneNo, emailAddress, password },
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        phoneNo,
        emailAddress,
        password: hashedPassword,
        role: "user",
        userStatus: "active",
      });

      await user.save();
      req.session.isLoggedIn = false;
      req.session.user = null;
      res.redirect("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).render("signup", {
        isLoggedIn: false,
        errors: ["Something went wrong. Please try again."],
        oldInput: { username, phoneNo, emailAddress, password },
      });
    }
  },
];