const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// LOGIN USER

exports.loginUser = async (username, password, done) => {
	const rows = await prisma.user.findUnique({
		where: { name: username },
	});

	const user = rows;

	if (!user) {
		return done(null, false, { message: 'Incorrect username' });
	}

	// check hashed passwords
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		// passwords do not match!
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
