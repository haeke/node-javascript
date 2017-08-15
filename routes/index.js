const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// route specific middleware example
router.get('/', storeController.homePage);

//add store controller
router.get('/add', storeController.addStore);

//post items from the editstore page
router.post('/add', storeController.createStore);

module.exports = router;
