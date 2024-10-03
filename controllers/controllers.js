// include validation
// and cryptography
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// HELLO WORLD
exports.helloWorld = async (req, res) => {
	const list = await prisma.user.findMany();
	res.send(`Hello world, ${list[0].email}`);
};
