const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

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

// CREATE ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
});


router.post("/", isLoggedIn, (req, res) => {
    // get data from the form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
         name: name, 
         image: image, 
         description: desc,
         author: author
        }
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

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
