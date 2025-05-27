const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // Automatically log in the user after registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wonderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login',
    saveRedirectUrl, // Middleware to save the redirect URL
    passport.authenticate('local', {
        successRedirect: '/listings',
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || '/listings');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are Logged out!');
        res.redirect('/listings');
    });
});

module.exports = router;