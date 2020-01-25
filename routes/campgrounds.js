const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const Notification = require('../models/notification');
const middleware = require('../middleware');
const Review = require("../models/review");
const cloudinary = require('cloudinary');
const multer = require('multer');

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

cloudinary.config({
  cloud_name: 'dkezhjprr',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// =============================
// CAMPGROUNDS ROUTES
// =============================

// INDEX route - list all campgrounds
router.get('/', async (req, res) => {
  var noMatch = false;
  try {
    // If there is a search: find all corresponding campgrounds in the database
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      let campgrounds = await Campground.find({ name: regex });
      if (campgrounds.length == 0) var noMatch = true;
      res.render('campgrounds/index', { campgrounds, noMatch });
      // Else: retrieve all campgrounds from the database
    } else {
      let campgrounds = await Campground.find({})
      res.render('campgrounds/index', { campgrounds, noMatch });
    }
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    let result = await cloudinary.v2.uploader.upload(req.file.path)
    // Add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    // Add image's public_id to campground object
    req.body.campground.imageId = result.public_id;
    // Add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }
    //  Create the new campground
    let campground = await Campground.create(req.body.campground);
    // Populate the followers of the user who made the campground
    let user = await User.findById(req.user._id).populate('followers').exec();
    let newNotification = {
      username: req.user.username,
      campgroundSlug: campground.slug
    }
    // Iterate over the followers to add the new notification to their notification list
    for (const follower of user.followers) {
      let notification = await Notification.create(newNotification);
      follower.notifications.push(notification);
      follower.save()
    }
    res.redirect('/campgrounds/' + campground.slug);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
})

// NEW route - display from to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW route - display info about one campground
router.get('/:slug', async (req, res) => {
  try {
    // / Find campground with slug
    let campground = await Campground.findOne({ slug: req.params.slug })
      .populate('comments')
      .populate('likes')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } }
      })
      .exec();
    // Render show campground
    res.render('campgrounds/show', { campground });
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('back');
  }
});

// EDIT route - Display edit form for one campground
router.get('/:slug/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findOne({ slug: req.params.slug }, (err, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

// UPDATE ROUTE - update information for one campground and redirect
router.put('/:slug', middleware.checkCampgroundOwnership, upload.single('image'), async (req, res) => {
  try {
    let campground = await Campground.findOne({ slug: req.params.slug });
    // If a new image is uploaded
    if (req.file) {
      // Remove the image in the cloud
      await cloudinary.v2.uploader.destroy(campground.imageId);
      // Upload the new given image
      var result = await cloudinary.v2.uploader.upload(req.file.path);
      // Update the attributes of the image of the campground
      campground.imageId = result.public_id;
      campground.image = result.secure_url;

    }
    // Update the other attributes of the campground
    campground.name = req.body.name;
    campground.description = req.body.description;
    campground.price = req.body.price;
    // Save the campground in the database
    campground.save();
    // Flash success message
    req.flash('success', 'Campground successfully updated');
    // Redirect towards the show page
    res.redirect('/campgrounds');
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('back');
  }
});



// DESTROY route - delete one campground and redirect
router.delete("/:slug", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    let campground = await Campground.findOne({ slug: req.params.slug });
    // Delete image in the cloud
    await cloudinary.v2.uploader.destroy(campground.imageId);
    // Delete all associated comments
    await Comment.deleteMany({ "_id": { $in: campground.comments } });
    // Delete all associated reviews
    await Review.deleteMany({ "_id": { $in: campground.reviews } });
    // Remove campground
    campground.remove()
    // Flash success deletion
    req.flash('success', 'Campground successfully deleted');
    // Redirect to the index page of campgrounds
    res.redirect('/campgrounds')
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("back");
  }
});


// Campground Like Route
router.post("/:slug/like", middleware.isLoggedIn, async (req, res) => {
  try {
    let campground = await Campground.findOne({ slug: req.params.slug });
    // check if req.user._id exists in foundCampground.likes
    // Is true if one of the like is the current user
    // When it finds a match, it stops
    var foundUserLike = campground.likes.some(like => {
      return like.equals(req.user._id);
    })
    // If User already liked: remove like
    if (foundUserLike) {
      campground.likes.pull(req.user._id);
      // Else: ddd the new user like
    } else {
      campground.likes.push(req.user);
    }
    // Save the campground
    await campground.save();
    // Redirect to the campground SHOW page
    return res.redirect("/campgrounds/" + campground.slug);
    // 
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("back");
  }

});


// Transform a search into a standardized string
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;