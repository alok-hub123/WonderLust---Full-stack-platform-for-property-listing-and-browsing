const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); // populate the reviews field means since we are using reference of review in listing model so when try to access it will show Object id only so to see the data we need to populate it
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const fullAddress = `${listing.location}, ${listing.country}`;
  let lat = 40.7128;
  let lng = -74.006;

  try {
    const geoResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: fullAddress,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (geoResponse.data.results.length > 0) {
      lat = geoResponse.data.results[0].geometry.location.lat;
      lng = geoResponse.data.results[0].geometry.location.lng;
    }
  } catch (error) {
    console.error("Geocoding failed:", error.message);
  }

  res.render("listings/show.ejs", {
    listing,
    googleMapsKey: process.env.GOOGLE_MAPS_API_KEY,
    lat,
    lng,
  });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,filename)
  const newListing = new Listing(req.body.listings);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Successfully created a new listing!"); // flash message
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateLisitng = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Successfully updated a listing!"); // flash message
  res.redirect(`/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a listing!");
  console.log(deletedListing);
  res.redirect("/listings");
};

// module.exports.searchListings = async (req, res) => {
//   let { q } = req.query;
//   console.log(q);
//   q = String(q);
//   const allListings = await Listing.find({
//     $or: [
//       { title: { $regex: q, $options: "i" } },
//       { description: { $regex: q, $options: "i" } },
//       { location: { $regex: q, $options: "i" } },
//       { country: { $regex: q, $options: "i" } },
//     ],
//   });
//   res.render("listings/index.ejs", { allListings });
// };
