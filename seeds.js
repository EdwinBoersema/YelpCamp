const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722d79d69f49c051_340.jpg",
        description: "athaerdfawef"
    },
    {
        name: "Forest Valley",
        image: "https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c722d79d69f49c051_340.jpg",
        description: "atawefawefwef"
    },
    {
        name: "Rocky Retreat",
        image: "https://pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c722d79d69f49c051_340.jpg",
        description: "athawefawef"
    },
    {
        name: "Swimmers Bay",
        image: "https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c722d79d69f49c051_340.jpg",
        description: "aawefawfawefawefef"
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            // add a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a campground!");
                        // add a few comments
                        Comment.create({
                            text: "This place was great but I wish there was internet!",
                            author: "Homer"
                        }, (err, comment) => {
                            if (err) {
                                console.log(err);
                            } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment!");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;