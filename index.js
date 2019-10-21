const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// default route
app.get("/", (req, res) => {
    res.render("landing");
});

// campgrounds array
const campgrounds = [
    { name: "Salmon Creek", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/49549058324311.59f8339842af3.png" },
    { name: "Thornbury Hills", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0e7f3f60632151.5a544ee6a44c7.jpg" },
    { name: "Sunset Plains", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/54999c60632151.5a5450ae5dd49.jpg" }
];

//Campgrounds route
app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", (req, res) => {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    var newCampground = { name: name, image: image }
    campgrounds.push(newCampground);
    // redirect to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// starting the server on port 3000
app.listen(3000, () => console.log("YelpCamp server started."));