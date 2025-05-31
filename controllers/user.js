const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.createUser = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are Logged out!');
        res.redirect('/listings');
    });
}