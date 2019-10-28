const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// default route
app.get("/", (req, res) => {
    res.render("landing");
});

//Campgrounds route
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", (req, res) => {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    var newCampground = { name: name, image: image }
    // Create a new campground and save to database
    Campground.create(newCampground, (err, newlyCreated) =>{
        if (err) {
            console.log(err);
        } else {
            // redirect back to /campgrounds
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

// SHOW route
app.get("/campgrounds/:id", (req, res) => {
    res.send("This is the SHOW ROUTE");
});

// starting the server on port 3000
app.listen(3000, () => console.log("YelpCamp server started."));