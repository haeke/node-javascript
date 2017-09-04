const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: 'you must supply an author',
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'store',
    required: 'You must supply a store',
  },
  text: {
    type: String,
    requred: 'Your review must have text',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
