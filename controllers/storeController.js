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
  //console.log(stores);
  res.render('stores', { title: 'Stores', stores: stores });
};

//route for editing a stores information
exports.editStore = async (req, res) => {
  // find the store from the id
  const store = await Store.findOne({ _id: req.params.id });

  // confirm they are the owner of the store

  // render the edit form so the user and update the info
  res.render('editStore', { title: `Edit ${store.name}`, store: store });
};

//handle updating a store
// find and update the store, run the validators, send a flash message for successful updates and redirect to the edit page
exports.updateStore = async (req, res) => {
  //find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id  }, req.body, {
    new: true, //return the new store and not the old store
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated ${store.name} <a href="/stores/${store.slug}">View Store`);
  res.redirect(`/stores/${store._id}/edit`);
  //redirect to the store with a message
};
