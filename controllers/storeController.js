const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

//use async await to add data into the mongoDB database
exports.createStore = async (req, res) => {
  //create the store with mongoDB
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

// remember to add catchErrors when using async await in our route specific middleware
exports.getStores = async (req, res) => {
  //query the database for list of all the stores stores
  const stores = await Store.find(); //query for all the items in the store
  console.log(stores);
  res.render('stores', { title: 'Stores', stores: stores });
};
