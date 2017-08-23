// we are going to use strict mode
// requires that we define the meta data before we can populate the DB with data
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

// make the schema
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Enter a store name',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates',
    }],
    address: {
      type: String,
      required: 'You must supply an address',
    },
  },
  photo: String,
});

//pre save hook - set the slug property
storeSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; //stop the function
  }
  // set the slug property
  this.slug = slug(this.name);
  next();
  //TODO make slugs more unique
});

// reference for outside of this file
module.exports = mongoose.model('Store', storeSchema);
