const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const middleware = require("../middleware");

// =============================
// REVIEWS ROUTES
// =============================

// INDEX route
router.get("/", async (req, res) => {
    try {
        let campground = await Campground.findOne({ slug: req.params.slug }).populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } } // Sorting the populated reviews array to show the latest first
        }).exec()
        res.render("reviews/index", { campground });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// NEW route
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, async (req, res) => {
    // middleware.checkReviewExistence checks if a user already reviewed the campground, only one review per user is allowed
    try {

        let campground = await Campground.findOne({ slug: req.params.slug });
        res.render("reviews/new", { campground });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

//  CREATE route
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, async (req, res) => {
    try {
        let campground = await Campground.findOne({ slug: req.params.slug }).populate("reviews").exec();
        let review = await Review.create(req.body.review);
        // Add author username/id and associated campground to the review
        review.author.id = req.user._id;
        review.author.username = req.user.username;
        review.campground = campground;
        // Save review
        review.save();
        campground.reviews.push(review);
        // Calculate the new average review for the campground
        campground.rating = calculateAverage(campground.reviews);
        // Save campground
        campground.save();
        req.flash("success", "Your review has been successfully added.");
        res.redirect('/campgrounds/' + campground.slug);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// Function that calculates the average of all the reviews' ratings
function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

// EDIT route
router.get("/:review_id/edit", middleware.checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, (err, foundReview) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", { slug: req.params.slug, review: foundReview });
    });
});


// UPDATE route
router.put("/:review_id", middleware.checkReviewOwnership, async (req, res) => {
    try {
        // Update the review
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review, { new: true });
        // Update the associated campground object in which the review is
        let campground = await Campground.findOne({ slug: req.params.slug }).populate("reviews").exec();
        // Recalculate campground average rating
        campground.rating = calculateAverage(campground.reviews);
        // Save changes
        campground.save();
        // Flash success message
        req.flash("success", "Your review was successfully edited.");
        // Redirect to the campground page
        res.redirect('/campgrounds/' + campground.slug);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// DESTROY route
router.delete("/:review_id", middleware.checkReviewOwnership, async (req, res) => {
    try {
        // Delete review
        await Review.findByIdAndRemove(req.params.review_id);
        // Update the associated campground object in which the review is
        let campground = await Campground.findOneAndUpdate({ slug: req.params.slug }, { $pull: { reviews: req.params.review_id } }, { new: true }).populate("reviews").exec();
        // Recalculate campground average rating
        campground.rating = calculateAverage(campground.reviews);
        // Save changes
        campground.save();
        // Flash success message
        req.flash("success", "Your review was successfully edited.");
        // Redirect to the campground page
        res.redirect('/campgrounds/' + campground.slug);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

module.exports = router;