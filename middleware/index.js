// Include all middleware here
const middleware = {};

middleware.checkCO = (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            res.redirect("back");
        } else {
            // check if the user owns the campground
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                redirect("back");
            }
        }
    });
}

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("back")
}

module.exports = middleware;
