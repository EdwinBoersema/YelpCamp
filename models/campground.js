const mongoose = require("mongoose");

// Schema setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

module.exports = mongoose.model("Campground", campgroundSchema);
