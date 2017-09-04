const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//error handler for our controllers
const { catchErrors } = require('../handlers/errorHandlers');

// route specific middleware example
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

//add store controller
router.get('/add', authController.isLoggedIn, storeController.addStore);

//post items from the editstore page
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

//handle adding an edited store page
router.post('/add/:id/',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore));

//edit store route
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

//single store route
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

//tags page
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

//login route for the user controller
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

//route for account page
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));

//confirm that their passwords are the same
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update));

//map page route
router.get('/map', storeController.mapPage);
//get a users of hearted stores
router.get('/hearts', catchErrors(storeController.getHearts));

// API endpoints
router.get('/api/search', catchErrors(storeController.searchStores));
// route that returns the 10 nearest stores given a lat and lng
router.get('/api/stores/near', catchErrors(storeController.mapStores));
// route for individual hearted stores
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));



module.exports = router;
