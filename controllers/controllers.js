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
	res.render('userPage');
};
