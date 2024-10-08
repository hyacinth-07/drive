// include validation
// and cryptography
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const db = require('../prisma/dbFunctions');
const bcrypt = require('bcryptjs');

// HELLO WORLD
exports.helloWorld = async (req, res) => {
	res.render('helloWorld', { user: req.user });
};

// SIGN UP POST

exports.signUp = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	if (password != confirmPassword) {
		res.send('Passwords do not match!');
		return;
	}

	// validation goes here

	try {
		bcrypt.hash(password, 10, async (err, hashedPassword) => {
			if (err) return err;
			await db.addUser(username, hashedPassword);
			res.redirect('/');
		});
	} catch (error) {
		return next(error);
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
