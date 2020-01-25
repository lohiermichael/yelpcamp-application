const express = require('express');
const router = express.Router();
const passport = require('passport');
const Campground = require('../models/campground');
const Notification = require('../models/notification');
const User = require('../models/user');
const async = require("async");
const nodemailer = require("nodemailer");
// No need to install it as it is past of node
const crypto = require("crypto");
const middleware = require("../middleware");



// Landing page
router.get('/', (req, res) => {
  res.render('landing');
});

// =============================
// AUTH ROUTES
// =============================

// Show register form
router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

// Handle sign up logic
router.post('/register', (req, res) => {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    // Add an avatar if given otherwise give the one by default
    avatar: req.body.avatar ? req.body.avatar : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAADpCAMAAABx2AnXAAAAllBMVEX////S19sREiQAAADa2tvP1NgODyL29/jT19vu8PLd4eTW2t74+Pny8/TZ3eHi5egAABcAABoAABgAABPp6+0HCR+UlJpBQUxtbnYnKDYAAA8XGCmMjZScnKCAgIYAAB06OkaIiJAhIjB0dH1VVl9hYWs0M0BKSlRiY2uqq652eIBNUFnDxcg/QU81N0TPz9K1trelp6lUH+oiAAAJMklEQVR4nO1dC3uiOhCtUBDxgYrhoYiiKEqf9///uQuirX1sk5kMYPvlfNvdtroOJ5k5MwkhubtTUFBQUFBQUFBQUFBQUFBQUICj2x3OHMe27dHpj+04s96w2/ZVSaHbc+y+ZRmG0fmA4heW1bed3i+kN+g5/S+EPqN4Q9/pDdq+VnEMnRGP0zW7kTNs+4pF0LMtYVJv5Dp2r+3r/hlDW7yrPnecfbP9NnA6SFaXfnNuMd6GIzlaFbXRrXVbry/N6sytf0vRRkbrtqiR0rodasMRMa0TtVHbRcnAroHWiZrdqkLO6mFVYdYarYGYFxrGuWo0uNXjx/83aqnTZgJXWZS59uytih8MejO7L57vjDY6TaS7jNHsGxEYiJeTLXRaj39Rndm/r6onrKUNK7/Duy6DVxyJVpaG0wyj6qJ47W30BWq+gZimNuiOXYt3LYJBL5gFrYay9ZDXXYAm5ofq6RMbqfl5Kg8Liq5tj/ga2YTuc3khrmHI16LamfEuwcDJMzfa6hZHLi90y3I/uVZm9fG6u2uzz7ihYMt8ep/z4fUx41a9famP56WR2phxeRmSiZTXZTVpY6/2BuVawGruj+hyrco5YgmeBXmn+IoBrz6kaE2bz8yirohHXJPyHcaXjwIjeTPX4Ao9SWAP+LyIpZEf1h2Dwg5XFzu0AiLSklK5+QKBICtAF2b8ACNqR7ExNVmYicyzdUgsCbh8hy5PD0Ss0bSiiCyWzGicUSSiOzRa1RXiRdSMQo5IJFUiKnUy11BuIZtuESVGoYxiCtyhqeHEiUlnF37tS9WCJcSJSVfDAimsFWKy+iGWWNogJilXQlJfoukYkxxNCHcYlSpyR31XJmW6TNgOUR7j3u64hoW3I9xhRSyTBJlo5SHbmMIRVrYfxTIo0eRSAR1lgiWpfANiLWKbUjSHnc0Q1G8A3y+BzGUgh6chJlRwX5nEBbbTAjGYSeRgCWiEYkgGbEvcuH1oQJIKDTHBocQFFko+gEZI5qkasQm1QUEMpsMd1GwmUHnbIgZPnmCvoJhhgZQ6FeCtCVQOGmJgm3BdhBU3RMSEZjA/AqyL4IxCcR8JVgNXgCYZuLcTEEO4CdQqwikIpu/hSgyuFzEm5Cd0UMRggo8IMUP+9nB3Bk8ywCCDhxjRsw1DsGFYkMEf2qO6zQgckgGrKrju0t3Mh1oGTXbDo5juXj40CkDqAdcOulVO4PCGtClcnFokBqmD4aLYniuCZBFe2pMs8zgBbBow1Q25N3AGwUqqs204MfFMg6myqYjBbQP0HlFlkyVoeKYBDMnA2Z9w6RY80wBmajGPXlLJIqIMFieGqO3J1AMxwhVvUwwxkvWKdc8OINyB6i40JgrEcyiGGFGQITyxbmI0AxfMlETNxEjWsCASTe3ESNZ9Yjyx9h4jEHzU5FjtxAiW2tVtF0nMsKV2z+pi95oQJ4ZJ0BU1mThD73hSb+UBtfEVKOGAGcXvPyJBDFNMVRB3E5w4lZDI0mijgBET5nZOBQnJRyoWqErFe4VEjY81CZkagE+ovBlB1/ioO3IVADkGPkt1AVrv8YIFWWkKXm/xBrR6NGMSHcjoGl/CEyGVHGr0cAK29mjIIj6RYX2xjw5r0MSfhGPgHjrBZ07gVC3aDHLwIhHUsMl1vEahukzCQ4C+j6/vUVEm02EwtZLweUT1IaFVYGsy+0FCK2EZXuD7VxJBBm1EGe+AOz4+YYJvKcl1GLQgwI9cwMSkegyuwegZiGaJwUe2EoIPjDEZ50BMssgUOTBiMtkZM7CVsAb0e5keg/OS8UUgMQlemOm+LvShnXcAB5tonbJwQwm0PahS4YsB3GwfOkdDiwH8jCJuuI5YUVUB6vjoFsQur0bKB7gd0TUV9k4BMnOCcws2Q+O3vsBFNXyaG8dL4g4IqiktuFQhG1BipT/KItzzccEss7AEUzAiyjdUXSq3xgnTZQgzCCuSK4EQC1kxGox5RkjyWRp4VYAxiFAp2UUl4MESziD8OWHplVvNbNgAlQ+KhVugIh+9ESfQ5SkW6oIaE28QxItmOSugMft4zx8UNYuwHaIHToTbUWqrI8gxSzS8BJ3RkH7Uqid4Bg/dERMC+ZPmzDCxRE24UzB3K3qqo9BE/JHswac7TmVgGZTn/Ax558/R7jP+w+jdsIh3oe/96B/UO8P/azNuclolflh+RH9KwffVXOOnIRBvnl7iOwep82CO77W/BktfphnrPl9w9o2M1HL800dpbOJEyM8ndNIfvFDhqgLhnptGZfJ6zXp9h1pdRL8pWiXeqdVxBMgFJ2ZNn7h6plYnr5IZaZkhiJJavbwKZk2eJXhl9ibO5VVQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQ+Lu4/6O40/8o7rQ/CkXst+FMzDx/aVf/ahpjmsnefypeYu8v3jgqYua6oBAuqu/3i/Nr4zR1w/WF2SJj5ibd/xZmFbHV4TAZR2N3rE1dPVow150yVz8WCJa6q+uM6fr+RdefkyfG+cBbwbnHNpG7iXMv1mNvG3t7z8uz5cP9g64HszSyXkL/3soefSt8em6yx8wyFjTTPP19CovTT2YZLuV35W/ZqvzSpqa5Kl9brdg1Mc2NFkGwHW+Dg64nq0jTt9t07r/YceCFL/rh+LjWw5k1YY3GGHt42K42k83CH4cTM4399SQcbxZxcf3hNFwtFhs32AWHJEty/ajlcebto12csmtik12apN4uyH3mJmw5HxdvZ3N9dR972au+fn2Zz0PnZdOsH5phnuTHNPGPh+3h+JBky3wbJE+P6TxO8yCPlomfr3exlyZH/7/5OtGWxTsePhIz2THfRCwMPXOz2wU7zds9rJZB9Ph0H95vH3PvNfdfsvt5o8Q01wuSIIv8ZbyLl+vAi6JDkvivQehl0S5KvTTy13kUp2l0eFwvC47LbZwGk2ti2iTYsDDJWRht5wf9kGz2e5Z68dTdZSvv4M4Llwz07bpZTTRDbeqzfRiuniahlrkhW8/34SZ8Zr7rs0W4yLQwY09uNnU3WpZunnV/+uybH4hpkyISpxPNHE+0ibYal5HJ3KmpTZjproqXXXNSvqdZVDJhnqRCYxfJMM8/mRdBKTNskXTN6rfaR2J/DYrYb8OfJfY/ZiavutQnqkIAAAAASUVORK5CYII='
  })

  // If the admin code given is wrong
  if (req.body.adminCode === 'secret123') {
    newUser.isAdmin = true;
    register(isAdmin = true);
  } else if (req.body.adminCode === '') {
    newUser.isAdmin = false;
    register(isAdmin = false);
  } else {
    req.flash('error', 'You gave a wrong admin code');
    res.redirect('/register');
  }

  function register(isAdmin) {
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/register');
      }
      passport.authenticate('local')(req, res, function () {
        req.flash('success', `Welcome to YelCamp ${user.username}`);
        if (isAdmin) {
          req.flash('success', ' you have signed up as an admin')
        }
        res.redirect('/campgrounds');
      });
    });
  }

});

// Show login form
router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
});

// Handle login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    successFlash: 'Welcome!',
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => { }
);

// Handle logout
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Successfully logged out');
  res.redirect('/campgrounds');
});


// User profile
router.get("/users/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let campgrounds = await Campground.find().where('author.id').equals(user._id).exec();
    res.render('users/show', { user, campgrounds });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// Follow user
router.get("/follow/:id", middleware.isLoggedIn, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    user.followers.push(req.user._id);
    user.save();
    req.flash('success', `Successfully following ${user.username} !`);
    res.redirect(`/users/${req.params.id}`)
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// View notifications
router.get("/notifications", middleware.isLoggedIn, async (req, res) => {
  try {
    let user = await User.findById(req.user._id)
      .populate({
        path: 'notifications',
        options: { sort: { 'id': -1 } }
      })
      .exec();
    let allNotifications = user.notifications;
    res.render('notifications/index', { allNotifications });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// Handle notification
router.get("/notifications/:id", middleware.isLoggedIn, async (req, res) => {
  try {
    console.log('hello');
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    res.redirect(`/campgrounds/${notification.campgroundSlug}`)
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// Forgot password: GET route
router.get("/forgot", (req, res) => {
  res.render('password/forgot');
});

// Forgot password: POST route
router.post('/forgot', function (req, res, next) {
  async.waterfall([
    // Make a token
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    // Find the user with the given address
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          // If no mail found redirect to the forgot page with a flash error
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        // Set the two following attributes for the reset
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        // Save the user as is 
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    // Send mail using the nodemailer library
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'michael.lohier.webdev@gmail.com',
          pass: process.env.GMAIL_ADMIN_PASSWORD
        }
      });
      // Draft email structure
      var mailOptions = {
        to: user.email,
        from: 'michael.lohier.webdev@gmail.com',
        subject: 'Yelpcamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      // Send the email
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('Mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// Reset password: GET route
router.get('/reset/:token', function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    // The date of the expiration of the token has to be greater than now
    resetPasswordExpires: { $gt: Date.now() }
  },
    (err, user) => {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('password/reset', { token: req.params.token });
    });
});

// Reset password: POST route
router.post('/reset/:token', (req, res) => {
  async.waterfall([
    function (done) {
      // Find an user in the database that matches the who to whom the token was sent
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        // Check if the password and its confirmation match
        if (req.body.password === req.body.confirm) {
          // Passport method to reset and hash the new password
          user.setPassword(req.body.password, function (err) {
            // Reset the token attributes of the user to undefined
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            // Save the new user and log him in
            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          })
          // If the passwords don't match redirect the user
        } else {
          req.flash("error", "Passwords do not match.");
          return res.redirect('back');
        }
      });
    },
    // Send another email to the user to confirm that his password is indeed reset
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'michael.lohier.webdev@gmail.com',
          pass: process.env.GMAIL_ADMIN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'michael.lohier.webdev@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        // when the mail is sent, flash a success message to the user
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    // Finally after the pipe of consecutive executions redirect to the campground page
    res.redirect('/campgrounds');
  });
});


module.exports = router;
