const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// =============================
// COMMENTS ROUTES
// =============================

// NEW route
router.get('/new', middleware.isLoggedIn, async (req, res) => {
  try {
    let campground = await Campground.findOne({ slug: req.params.slug });
    res.render('comments/new', { campground });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// CREATE route
router.post('/', middleware.isLoggedIn, async (req, res) => {
  try {
    let campground = await Campground.findOne({ slug: req.params.slug });
    // Create new comment
    let comment = await Comment.create(req.body.comment);
    // Add username and id to the comment
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    // Save comment
    comment.save();
    // Connect new comment to campground
    campground.comments.push(comment);
    req.flash('success', 'Successfully added comment');
    campground.save();
    // Redirect to the SHOW page of the campground of the comment
    res.redirect(`/campgrounds/${req.params.slug}`);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// EDIT route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.comment_id);
    res.render('comments/edit', { campground_slug: req.params.slug, comment });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// UPDATE route
router.put('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    res.redirect(`/campgrounds/${req.params.slug}`);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// DESTROY route
router.delete('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.comment_id);
    res.redirect(`/campgrounds/${req.params.slug}`);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

module.exports = router;
