const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

//error handler for our controllers
const { catchErrors } = require('../handlers/errorHandlers');

// route specific middleware example
router.get('/', storeController.homePage);

//add store controller
router.get('/add', storeController.addStore);

//post items from the editstore page
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
