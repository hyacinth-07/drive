const express = require('express');
const router = express.Router();
const driveController = require('../controllers/controllers');
// FILE UPLOAD
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

///// FILE UPLOAD ////

router.get('/upload', driveController.verifyUser, driveController.uploadScreen);

router.post(
	'/upload',
	driveController.verifyUser,
	upload.single('file'),
	driveController.uploadFiles
);

// GET USER FILES AND FOLDERS
router.get(
	'/:userId',
	driveController.verifyUser,
	driveController.getFilesAndFolders
);

// ADD FOLDERS
router.post(
	'/addFolder',
	driveController.verifyUser,
	driveController.validateFolderName,
	driveController.addFolder
);

// RENAME FOLDERS GET
router.get(
	'/:userId/:folderId/rename',
	driveController.verifyUser,
	driveController.renameFolderGet
);

// RENAME FOLDERS POST
router.post(
	'/:userId/:folderId/rename',
	driveController.verifyUser,
	driveController.validateRename,
	driveController.renameFolderPost
);

// DELETE FOLDER GET
router.get(
	'/:userId/:folderId/delete',
	driveController.verifyUser,
	driveController.deleteFolderGet
);

// DELETE FOLDER POST
router.post(
	'/:userId/:folderId/delete',
	driveController.verifyUser,
	driveController.deleteFolder
);

// GET FOLDER CONTENT
router.get(
	'/:userId/:folderId',
	driveController.verifyUser,
	driveController.getFolderContent
);

// DELETE FILES NOT IN FOLDER
router.get(
	'/:userId/_/:fileId/delete',
	driveController.verifyUser,
	driveController.getFilesNotInFolder
);

router.post(
	'/:userId/_/:fileId/delete',
	driveController.verifyUser,
	driveController.getDeleteFiles
);

// DOWNLOAD FILES NOT IN FOLDER
router.get(
	'/:userId/_/:fileId/download',
	driveController.verifyUser,
	driveController.getDownloadFiles
);

router.post(
	'/:userId/_/:fileId/download',
	driveController.verifyUser,
	driveController.downloadFile
);

// DELETE FILES IN FOLDERS
router.get(
	'/:userId/:folderId/:fileId/delete',
	driveController.verifyUser,
	driveController.getFilesNotInFolder
);

router.post(
	'/:userId/:folderId/:fileId/delete',
	driveController.verifyUser,
	driveController.getDeleteFiles
);

// DOWNLOAD FILES IN FOLDERS
router.get(
	'/:userId/:folderId/:fileId/download',
	driveController.verifyUser,
	driveController.getDownloadFiles
);

router.post(
	'/:userId/:folderId/:fileId/download',
	driveController.verifyUser,
	driveController.downloadFile
);

module.exports = router;
