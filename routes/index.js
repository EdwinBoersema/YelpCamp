const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const mw = require("../middleware/index");

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
    let newUser = new User({
        username: req.body.username,
        roles: "user"
    });
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
// EDIT USER
router.get("/edit", mw.isLoggedIn, (req, res) => {
    res.render("edituser");
});

router.put("/edit", mw.isLoggedIn, (req, res) => {
    let role = req.body.role;
    console.log(req.body.role);
    User.findByIdAndUpdate(req.user._id, {$addToSet: {roles: role}}, (err, user) =>{
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// LOGOUT ROUTE

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

module.exports = router;
