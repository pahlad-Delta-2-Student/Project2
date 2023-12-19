const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/listings"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

// // //New Route
app.get("/listing/new", (req, res) => {
  res.render("new.ejs");
});



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "New Villa Fam",
//     description: "Super Delux Resorts",
//     price: 2300,
//     location: "Kolkata",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("simple was saved");
//   res.send(sampleListing);
// });

app.get("/", (req, res) => {
  res.render("error.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//Middleware Handling
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(5000, () => {
  console.log("Server is listening on port : 5000");
});
