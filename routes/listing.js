const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/", async (req, res, next) => {
    const AllListings = await Listing.find({});
    let listLength = AllListings.length;
    res.render("index.ejs", { AllListings, listLength });
  });

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("show.ejs", { listing });
  })
);

//New Route
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

//Create Route
router.post(
  "/",

  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    console.log(newListing)
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
    res.redirect("/listings");
  })
);

module.exports = router;
