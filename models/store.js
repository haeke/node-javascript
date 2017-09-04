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
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: 'Supply an author',
  }
}, {
    toJSON: { virtuals: true }, //add virtuals to the schema
    toObject: { virtuals: true }, //add virtuals to the schema
});

//define the index for the name and description of stores
storeSchema.index({
  name: 'text',
  description: 'text',
});

storeSchema.index({ location: '2dsphere' });

//pre save hook - set the slug property
storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; //stop the function
  }
  // set the slug property
  this.slug = slug(this.name);
  // check for duplicate slug names if found add -(number) to it
  // use a RegEx to search for any slugnames that are the same
  const slugRegEx = new RegExp(`^(${this.slug}((-[0-9]*$)?)$)`, 'i'); //case insensitive
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next();

});

//custom static method to get the tags from all stores
storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    //group by tag field, create a new field called count, increment by 1
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

//get the top 10 stores
storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    //lookup stores and populate the reviews
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' } },
    //filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true} } },
    //add the average reviews field
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' },
    }},
    //sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 }},
    //limit to 10
    { $limit: 10 },
  ]);
};

//create relationship with store and review
//find reviews where the stores id is the same as the reviews store property
storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store',
});

function autopopulate(next) {
  this.populate('reviews');
  next();
};

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

// reference for outside of this file
module.exports = mongoose.model('Store', storeSchema);
