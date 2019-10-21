const express = require("express");
const app = express();

app.set("view engine", "ejs");

// default route
app.get("/", (req, res) => {
    res.render("landing");
});

//Campgrounds route
app.get("campgrounds", (req, res) => {
    const campgrounds = [
        {name: "Salmon Creek", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/49549058324311.59f8339842af3.png"},
        {name: "Thornbury Hills", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0e7f3f60632151.5a544ee6a44c7.jpg"},
        {name: "Sunset Plains", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/54999c60632151.5a5450ae5dd49.jpg"}
    ];
    res.render("campgrounds");
});

// starting the server on port 3000
app.listen(3000, () => console.log("YelpCamp server started."));