const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.createUser));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, // Middleware to save the redirect URL
    passport.authenticate('local', {
        successRedirect: '/listings',
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login
);

router.get('/logout', userController.logout);

module.exports = router;