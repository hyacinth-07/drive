const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	// ... you will write your Prisma Client queries here
	// createTestUser();
	// findUsers();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

// TEST FUNCTIONS

async function createTestUser() {
	const testUser = await prisma.user.create({
		data: {
			name: 'Mario',
			email: 'mario@mario.com',
			password: 'mario',
		},
	});
	console.log(testUser);
}

async function findUsers() {
	const list = await prisma.user.findMany();
	console.log(list);
}
