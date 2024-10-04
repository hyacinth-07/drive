// include validation
// and cryptography
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// HELLO WORLD
exports.helloWorld = async (req, res) => {
	res.render('helloWorld', { user: req.user });
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
