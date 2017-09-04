const mongoose = require('mongoose');
const Review = mongoose.model('Review');

//when a user posts a review - save the authors id, get the ID of the URL
exports.addReview = async (req, res) => {
  //id from the current logged in user
  req.body.author = req.user._id;
  //id from theURL
  req.body.store = req.params.id;
  //create a new review from the store page and add it to the database
  const newReview = new Review(req.body);
  //notify if successful
  req.flash('success', 'Review added');
  //res.json(req.body);
  //save to the database
  await newReview.save();
  res.redirect('back');
};
