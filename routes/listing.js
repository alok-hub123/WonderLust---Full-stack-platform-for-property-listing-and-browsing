const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const isLoggedIn = require('../middleware.js').isLoggedIn;

//validating data using Joi
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//listing route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render('listings/index.ejs', { allListings });
}));

//new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');  // populate the reviews field means since we are using reference od review in listing model so when try to access it will show Object id only so to see te data we need to populate it
     if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing: listing });
}));

//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!"); // flash message
    res.redirect("/listings");
})
);

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success", "Successfully updated a listing!"); // flash message
    res.redirect(`/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    console.log(deletedListing)
    res.redirect("/listings");
}));

module.exports = router;