const Campground = require('../models/campground');
const Comment = require('../models/comment');
const Review = require("../models/review");

// Collection of all the middleware used in the application
var middleware = {};
middleware.checkCampgroundOwnership = function (req, res, next) {
  // Condition 1 : to be logged in
  if (req.isAuthenticated()) {
    // Condition 2: owning the campground
    Campground.findOne({ slug: req.params.slug }, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // Mongoose method for comparison between object and string
        if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('Error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    // Redirect to the previous page
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
};

middleware.checkCommentOwnership = function (req, res, next) {
  // Condition 1 : to be logged in
  if (req.isAuthenticated()) {
    // Condition 2: owning the campground
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    // Redirect to the previous page
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // It doesn't show up immediately but on the next page as soon as we redirect
  req.flash('error', 'You need to be logged in to do that!');
  res.redirect('/login');
};

middleware.checkReviewOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, function (err, foundReview) {
      if (err || !foundReview) {
        res.redirect("back");
      } else {
        // Does user own the comment?
        if (foundReview.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middleware.checkReviewExistence = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findOne({ slug: req.params.slug }).populate("reviews").exec(function (err, foundCampground) {
      if (err || !foundCampground) {
        console.log(req.params.slug);
        req.flash("error", "Campground not found.");
        res.redirect("back");
      } else {
        // Check if req.user._id exists in foundCampground.reviews
        var foundUserReview = foundCampground.reviews.some(function (review) {
          return review.author.id.equals(req.user._id);
        });
        if (foundUserReview) {
          req.flash("error", "You already wrote a review.");
          return res.redirect("/campgrounds/" + foundCampground._id);
        }
        // if the review was not found, go to the next middleware
        next();
      }
    });
  } else {
    req.flash("error", "You need to login first.");
    res.redirect("back");
  }
};


module.exports = middleware;
