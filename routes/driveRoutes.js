const express = require('express');
const router = express.Router();
const driveController = require('../controllers/controllers');
// FILE UPLOAD
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// HELLO WORLD
router.get('/', driveController.helloWorld);

// SIGN UP POST
router.post('/sign-up', driveController.validateSignUp, driveController.signUp);

// LOG IN GET
router.get('/log-in', (req, res) => res.render('log-in'));

// LOGOUT GET
router.get('/log-out', driveController.logOut);

///// FILE UPLOAD -- MULTER ////

router.get('/upload', (req, res) => res.render('uploadForm'));

router.post('/upload', upload.single('file'), (req, res) => {
	res.send(req.body);
});

module.exports = router;
