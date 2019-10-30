const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comments");

// COMMENTS Route
router.get("/new", isLoggedIn, (req, res) => {
    // find campground
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("newComment", {campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) =>{
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add the username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user.id;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

