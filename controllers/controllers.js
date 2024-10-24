const { body, validationResult } = require('express-validator');
const db = require('../prisma/dbFunctions');
const bcrypt = require('bcryptjs');
const { supabase } = require('../supabase/supabaseClient');
const fs = require('fs');

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

// GET FILES AND FOLDERS
exports.getFilesAndFolders = async (req, res) => {
	const [folders, files] = await db.getFilesAndFolders(req.user.id);

	res.render('userPage', { user: req.user, folders: folders, files: files });
};

// GET RENAME SCREEN
exports.renameFolderGet = async (req, res) => {
	const userId = req.params.userId;
	const folder = await db.getOneFolder(req.params.folderId);

	res.render('updateFolder', {
		folderName: folder.name,
		backPath: userId,
	});
};

// POST RENAME SCREEN

exports.validateRename = [
	body('newName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Name is required')
		.escape(),
];

exports.renameFolderPost = async (req, res) => {
	const userId = req.params.userId;
	const folderId = req.params.folderId;
	const folderNewName = req.body.newName;

	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		// error works, but doesn't show properly
		console.log('must not be empty');
		res.redirect('/' + userId);
	} else {
		await db.renameFolder(folderId, folderNewName);
		res.redirect('/' + userId);
	}
};

// GET DELETE SCREEN
exports.deleteFolderGet = async (req, res) => {
	const userId = req.params.userId;

	const folder = await db.getOneFolder(req.params.folderId);
	res.render('deleteFolder', {
		folderName: folder.name,
		backPath: userId,
	});
};

// DELETE FOLDER
exports.deleteFolder = async (req, res) => {
	const userId = req.params.userId;
	const folderId = req.params.folderId;

	await db.deleteFolder(folderId);
	res.redirect('/' + userId);
};

// ADD FOLDERS

exports.validateFolderName = [
	body('folderName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Name is required')
		.escape(),
];

exports.addFolder = async (req, res) => {
	const folderName = req.body.folderName;
	const folderUser = req.user.id;

	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		// error works, but doesn't show properly
		console.log('must not be empty');
		res.redirect('/' + folderUser);
	} else {
		await db.addFolder(folderName, folderUser);
		console.log('Added folder!');
		res.redirect(`/` + folderUser);
	}
};

// GET FOLDER CONTENT
exports.getFolderContent = async (req, res) => {
	const folderContent = await db.getFolderContent(req.params.folderId);
	res.render('filePage', { files: folderContent, parentFolder: req.params });
};

// UPLOAD FILES
exports.uploadScreen = async (req, res) => {
	res.render('uploadForm', { user: req.user });
};

exports.uploadFiles = async (req, res) => {
	if (!req.file) {
		console.log('file does not exist');
		return res.redirect('/upload');
	}

	const { file } = req;

	try {
		const { data, error } = await supabase.storage
			.from('publicfiles')
			.upload(`uploads/${file.originalname}`, file.path);

		if (error) {
			throw error;
		}

		const url = supabase.storage
			.from('publicfiles')
			.getPublicUrl(`uploads/${file.originalname}`);

		await db.addFile(file, url.data.publicUrl, req.user.id);

		// clean up temporary folder
		fs.unlinkSync(file.path);

		res.redirect('/');
	} catch (error) {
		res.status(500).json({ error: error.message });
		fs.unlinkSync(file.path);
	}
};
