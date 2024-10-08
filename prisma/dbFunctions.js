const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ADD USER

exports.addUser = async (username, password) => {
	const newUser = await prisma.user.create({
		data: {
			name: username,
			email: `${username}@${username}.com`,
			password: password,
		},
	});
	console.log(newUser);
};
