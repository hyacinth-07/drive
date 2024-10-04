const express = require('express');
const router = express.Router();
const driveController = require('../controllers/controllers');

// HELLO WORLD
router.get('/', driveController.helloWorld);

// LOG IN GET
router.get('/log-in', (req, res) => res.render('log-in'));

// LOGOUT GET
router.get('/log-out', driveController.logOut);

module.exports = router;
