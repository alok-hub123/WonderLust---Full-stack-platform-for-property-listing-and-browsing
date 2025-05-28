const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isOwner, isLoggedIn, validateListing } = require('../middleware.js');
const listingController = require("")

//index route
router.get('/', wrapAsync());

//new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path:'reviews',
            populate: {
                path: "author",
            },
        })
        .populate("owner");  // populate the reviews field means since we are using reference of review in listing model so when try to access it will show Object id only so to see the data we need to populate it
     if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing: listing });
}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!"); // flash message
    res.redirect("/listings");
})
);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success", "Successfully updated a listing!"); // flash message
    res.redirect(`/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    console.log(deletedListing)
    res.redirect("/listings");
}));

module.exports = router;