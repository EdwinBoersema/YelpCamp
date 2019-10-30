const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// DEFAULT ROUTE 

router.get("/", (req, res) => {
    res.render("landing");
});

// AUTHENTICATION ROUTES

// show register form
router.get("/register", (req, res) =>{
    res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
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
router.get("/login", (req, res) =>{
    res.render("login");
});


// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) =>{

});

// LOGOUT ROUTE

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;