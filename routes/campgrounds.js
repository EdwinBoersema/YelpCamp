const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comments");

//Campgrounds route
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", (req, res) => {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc }
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

router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
});

// SHOW route
router.get("/:id", (req, res) => {
    // Find the correct campground, then show it
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Showing: " +foundCampground.name);
            res.render("show", {campground: foundCampground});
        }
    });
});

module.exports = router;