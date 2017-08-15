const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// route specific middleware example
router.get('/', storeController.myMiddleware, storeController.homePage);

module.exports = router;
