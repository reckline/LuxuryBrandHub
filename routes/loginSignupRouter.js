const express = require('express');
const loginSignupRouter = express.Router();
const loginSignupController = require('../controller/loginSignupController');

// --- LOGIN & SIGNUP ROUTES ---
// Note: Ensure controller functions are imported correctly and match these names
loginSignupRouter.get('/login', loginSignupController.getLogin);
loginSignupRouter.post('/login', loginSignupController.postLogin);
loginSignupRouter.get('/signup', loginSignupController.getSignup);
loginSignupRouter.post('/signup', loginSignupController.postSignup);
loginSignupRouter.get('/logout', loginSignupController.getLogout);

module.exports = loginSignupRouter;