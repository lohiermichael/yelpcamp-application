require('dotenv').config();

// Import Express
const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  methodOverride = require('method-override'),
  expressSession = require('express-session'),
  User = require('./models/user');

const app = express();

const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index'),
  reviewRoutes = require("./routes/reviews");

// Connect to the database
mongoose.connect(
  process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_backup',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  err => {
    if (err) console.error(err);
    else console.log('Connected to the mongodb');
  }
);

mongoose.set('useCreateIndex', true);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// We mention __dirname in case it changes
app.use(express.static(__dirname + '/public'));
// Execute the module to test the database

// Passport configuration
app.use(
  expressSession({
    secret: 'This is a good app',
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.locals.moment = require('moment');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function (req, res, next) {
  res.locals.currentUser = req.user;
  if (req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch (err) {
      console.log(err.message);
    }
  }
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:slug/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use("/campgrounds/:slug/reviews", reviewRoutes);

// Listen on a PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`YelpCamp server running on Port ${PORT}`));
