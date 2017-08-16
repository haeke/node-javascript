const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  req.flash('error', 'An error occured');
  req.flash('info', 'Information for what just happened');
  req.flash('warning', 'You might not want to do that');
  req.flash('success', 'That worked');
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

//use async await to add data into the mongoDB database
exports.createStore = async (req, res) => {
  //create the store with mongoDB
  const store = new Store(req.body);
  await store.save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  console.log('finished');
  res.redirect('/');
};
