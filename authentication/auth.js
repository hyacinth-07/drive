const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bycrypt = require('bcryptjs');

// LOGIN USER

exports.loginUser = async (username, password, done) => {
	const rows = await prisma.user.findUnique({
		where: { name: username },
	});

	const user = rows;

	if (!user) {
		return done(null, false, { message: 'Incorrect username' });
	}

	if (user.password !== password) {
		return done(null, false, { message: 'Incorrect password' });
	}
	return done(null, user);
};

// DESERIALIZE USER

exports.deserializeUser = async (id, done) => {
	const rows = await prisma.user.findUnique({
		where: { id: id },
	});
	const user = rows;
	done(null, user);
};
