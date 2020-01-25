const mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Campground name cannot be blank'
  },
  slug: {
    type: String,
    unique: true
  },
  imageId: String,
  image: String,
  description: String,
  price: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  rating: {
    type: Number,
    default: 0
  }
});

// Add a slug before the campground gets saved to the database
campgroundSchema.pre('save', async function (next) {
  try {
    // Check if a new campground is being saved, or if the campground name is being modified
    if (this.isNew || this.isModified('name')) {
      this.slug = await generateUniqueSlug(this._id, this.name);
    }
    next();
  } catch (err) {
    next(err);
  }
});

var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;

// Function to generate a slu
async function generateUniqueSlug(id, campgroundName, slug) {
  try {
    // Generate the initial slug
    if (!slug) {
      slug = slugify(campgroundName);
    }
    // Check if a campground with the slug already exists
    var campground = await Campground.findOne({ slug: slug });
    // Check if a campground was found or if the found campground is the current campground
    if (!campground || campground._id.equals(id)) {
      return slug;
    }
    // If not unique, generate a new slug
    var newSlug = slugify(campgroundName);
    // Check again by calling the function recursively
    return await generateUniqueSlug(id, campgroundName, newSlug);
  } catch (err) {
    throw new Error(err);
  }
}

function slugify(text) {
  var slug = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    .substring(0, 75); // Trim at 75 characters
  return slug + '-' + Math.floor(1000 + Math.random() * 9000); // Add 4 random digits to improve uniqueness
}
