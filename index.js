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

// Passport configuration
app.use(require("express-session")({
        secret: "flaters",
        resave: false,
        saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/campgrounds/new", isLoggedIn, (req, res) => {
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    // find campground
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("newComment", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// AUTHENTICATION ROUTES

// show register form
app.get("/register", (req, res) =>{
    res.render("register");
});

// handle sign up logic
app.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    }); 
});

// LOGIN ROUTE

// login form
app.get("/login", (req, res) =>{
    res.render("login");
});


// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) =>{

});

// LOGOUT ROUTE

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// starting the server on port 3000
app.listen(3000, () => console.log("YelpCamp server started."));