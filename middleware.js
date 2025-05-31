const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL to redirect again on requested page after login
        req.flash('error', 'You must be signed in to do that!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Store the original URL to redirect again on requested page after login
    }
    next();
}  

//validating data using Joi
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId } = req.params;
    let reviews = await Review.findById(reviewId);
    if(!reviews.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}