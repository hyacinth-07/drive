const { body, validationResult } = require('express-validator');
const db = require('../prisma/dbFunctions');
const bcrypt = require('bcryptjs');

// HELLO WORLD
exports.helloWorld = async (req, res) => {
	res.render('helloWorld', { user: req.user });
};

// VERIFY USER LOG IN
exports.verifyUser = async (req, res, next) => {
	if (!req.user) return res.redirect('/');
	next();
};

// SIGN UP POST

// validation middleware

exports.validateSignUp = [
	body('username')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Username is required')
		.escape(),
	body('password')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Password is required')
		.escape(),
];

exports.signUp = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	if (password != confirmPassword) {
		res.send('Passwords do not match!');
		return;
	}

	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		// error works, but doesn't show properly
		res.send({ errors: errors.array() });
		return;
	} else {
		try {
			bcrypt.hash(password, 10, async (err, hashedPassword) => {
				if (err) return err;
				await db.addUser(username, hashedPassword);
				res.redirect('/');
			});
		} catch (error) {
			return next(error);
		}
	}
};

// LOG OUT GET
exports.logOut = async (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

// GET FOLDERS
exports.getFolders = async (req, res) => {
	const folders = await db.getFolders(req.user.name);

	res.render('userPage', { user: req.user, folders: folders });
};

// GET RENAME SCREEN
exports.renameFolderGet = async (req, res) => {
	const folder = await db.getOneFolder(req.params.folderId);

	res.render('updateFolder', { folderName: folder.name });
};

// POST RENAME SCREEN
exports.renameFolderPost = async (req, res) => {
	const userId = req.params.userId;
	const folderId = req.params.folderId;
	const folderNewName = req.body.newName;

	await db.renameFolder(folderId, folderNewName);

	res.redirect('/' + userId);
};

// GET DELETE SCREEN
exports.deleteFolderGet = async (req, res) => {
	const folder = await db.getOneFolder(req.params.folderId);
	res.render('deleteFolder', { folderName: folder.name });
};

// DELETE FOLDER
exports.deleteFolder = async (req, res) => {
	const userId = req.params.userId;
	const folderId = req.params.folderId;

	await db.deleteFolder(folderId);
	res.redirect('/' + userId);
};

// ADD FOLDERS
exports.addFolder = async (req, res) => {
	const folderName = req.body.folderName;
	const folderUser = req.user.id;

	await db.addFolder(folderName, folderUser);
	console.log('Added folder!');
	res.redirect(`/` + folderUser);
};

// GET FILES
exports.getFiles = async (req, res) => {
	const files = await db.getFiles(req.params.folderId);
	res.render('filePage', { files: files, parentFolder: req.params });
};
