const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const seedDB = require("./seeds");
const Comment = require("./models/comments");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Uncomment to reseed te database on server startup
// seedDB();

// Connecting to the db
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(
    () => {
      console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

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
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", (req, res) => {
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

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

// SHOW route
app.get("/campgrounds/:id", (req, res) => {
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

// COMMENTS Route
app.get("/campgrounds/:id/comments/new", (req, res) => {
    // find campground
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("newComment", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) =>{
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});


// starting the server on port 3000
app.listen(3000, () => console.log("YelpCamp server started."));