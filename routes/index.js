const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

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
router.post('/add/:id/', catchErrors(storeController.updateStore));

//edit store route
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
