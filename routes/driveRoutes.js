const express = require('express');
const router = express.Router();
const driveController = require('../controllers/controllers');

// HELLO WORLD
router.get('/', driveController.helloWorld);

module.exports = router;
