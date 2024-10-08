const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ADD USER

exports.addUser = async (username, password) => {
	const mail = username.toLowerCase();

	const newUser = await prisma.user.create({
		data: {
			name: username,
			email: `${mail}@${mail}.com`,
			password: password,
		},
	});
	console.log(newUser);
};
