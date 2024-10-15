const express = require('express');
const router = express.Router();
const driveController = require('../controllers/controllers');
// FILE UPLOAD
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});

const upload = multer({ storage: storage });

// HELLO WORLD
router.get('/', driveController.helloWorld);

// SIGN UP GET
router.get('/sign-up', (req, res) => res.render('sign-up'));

// SIGN UP POST
router.post('/sign-up', driveController.validateSignUp, driveController.signUp);

// LOG IN GET
router.get('/log-in', (req, res) => res.render('log-in'));

// LOGOUT GET
router.get('/log-out', driveController.logOut);

// GET FOLDERS
router.get(
	'/:userId',
	driveController.validateSignUp,
	driveController.getFolders
);

// ADD FOLDERS
router.post(
	'/addFolder',
	driveController.validateSignUp,
	driveController.addFolder
);

// RENAME FOLDERS GET
router.get(
	'/:userId/:folderId/rename',
	driveController.validateSignUp,
	driveController.renameFolderGet
);

// RENAME FOLDERS POST
router.post(
	'/:userId/:folderId/rename',
	driveController.validateSignUp,
	driveController.renameFolderPost
);

// DELETE FOLDER GET
router.get(
	'/:userId/:folderId/delete',
	driveController.validateSignUp,
	driveController.deleteFolderGet
);

// DELETE FOLDER POST
router.post(
	'/:userId/:folderId/delete',
	driveController.validateSignUp,
	driveController.deleteFolder
);

// GET FILES
router.get(
	'/:userId/:folderId',
	driveController.validateSignUp,
	driveController.getFiles
);

///// FILE UPLOAD ////

router.get('/upload', driveController.verifyUser, (req, res) =>
	res.render('uploadForm')
);

router.post(
	'/upload',
	driveController.verifyUser,
	upload.single('file'),
	(req, res) => res.render('fileUploaded')
);

module.exports = router;
