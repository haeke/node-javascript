const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');

//error handler for our controllers
const { catchErrors } = require('../handlers/errorHandlers');

// route specific middleware example
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

//add store controller
router.get('/add', storeController.addStore);

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
router.get('/register', userController.registerForm);

router.post('/register', userController.validateRegister);

module.exports = router;
