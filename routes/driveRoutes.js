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

router.get('/upload', driveController.verifyUser, (req, res) =>
	res.render('uploadForm')
);

router.post(
	'/upload',
	driveController.verifyUser,
	upload.single('file'),
	(req, res) => {
		res.render('fileUploaded');
	}
);

module.exports = router;
