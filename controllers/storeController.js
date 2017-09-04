const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('user');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ mesesage: 'filetype not allowed' }, false);
    }
  },
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

//image upload
exports.upload = multer(multerOptions).single('photo');

//resize image
exports.resize = async (req, res, next) => {
  //confirm that theres no new photo to resize
  if (!req.file) {
    next(); //skip to the next middleware
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  //now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO); //height is auto
  await photo.write(`./public/uploads/${req.body.photo}`);
  //once it has been written to the file system - go to the next middleware
  next();

};

//use async await to add data into the mongoDB database
exports.createStore = async (req, res) => {
  req.body.author = req.user._id; //get the ID of the currently logged on user
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

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('Cannot edit because you didnt create it');
  }
};

//route for editing a stores information
exports.editStore = async (req, res) => {
  // find the store from the id
  const store = await Store.findOne({ _id: req.params.id });
  // confirm they are the owner of the store
  confirmOwner(store, req.user);
  // render the edit form so the user and update the info
  res.render('editStore', { title: `Edit ${store.name}`, store: store });
};

//handle updating a store
// find and update the store, run the validators, send a flash message for successful updates and redirect to the edit page
exports.updateStore = async (req, res) => {
  //set the location data to a point
  req.body.location.type = 'Point';
  //find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id  }, req.body, {
    new: true, //return the new store and not the old store
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated ${store.name} <a href="/stores/${store.slug}">View Store`);
  res.redirect(`/stores/${store._id}/edit`);
  //redirect to the store with a message
};

//store by slug
exports.getStoreBySlug = async (req, res, next) => {
  //if you need to check what data is available use req.json(req.params)
  //query for store information in the slug
  const store = await Store.findOne({ slug: req.params.slug }).populate('author');
  if (!store) {
    return next();
  }

  res.render('store', { store: store, title: store.name });
  //res.json(store); //check that the query works
};

//
exports.getStoresByTag = async (req, res) => {
  //get a list of all the tags in stores
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  res.render('tag', { tags: tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
  //search for the name or desciption in the schema
  const stores = await Store
  .find({
      $text: {
        $search: req.query.q,
      }
    }, {
      score: { $meta: 'textScore' },
  })
  .sort({
    score: { $meta: 'textScore' },
  })
  //limit to only 5 results example query in url: http://localhost:7777/api/v1/search?q=beer
  .limit(5);
  res.json(stores);
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  //search for locations near some latitude and longitude
  const q = {
    location: {
      $near: {
        type: 'Point',
        coordinates: coordinates,
      },
      $maxDistance: 10000, //10 kilometers
    },
  };

  const stores = await Store.find(q).select('slug name description location').limit(10);
  res.json(stores);
};

exports.mapPage = async (req, res) => {
  res.render('map', { title: 'Map' });
};

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  //add to set will throw away duplicates
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
  const user = await User
    .findByIdAndUpdate(req.user._id,
      { [operator]: { hearts: req.params.id } },
      { new: true }
  );
  res.json(user);
};

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts },
  });
  res.render('stores', { title: 'Hearted Stores', stores: stores });
};
