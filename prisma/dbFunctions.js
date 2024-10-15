const { PrismaClient } = require('@prisma/client');
const { name } = require('ejs');
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
	// console.log(newUser);
};

// --- FOLDER LOGIC --

exports.addFolder = async (folderName, folderUser) => {
	const newFolder = await prisma.folder.create({
		data: {
			name: folderName,
			userId: folderUser,
		},
	});

	// console.log(newFolder);
};

exports.getFolders = async (folderUser) => {
	const folder = await prisma.user.findFirst({
		where: {
			name: folderUser,
		},
		include: {
			folders: true,
		},
	});

	return folder.folders;
};

exports.getOneFolder = async (folderId) => {
	const folder = await prisma.folder.findFirst({
		where: {
			id: folderId,
		},
	});

	return folder;
};

exports.renameFolder = async (folderId, newName) => {
	const folder = await prisma.folder.update({
		where: {
			id: folderId,
		},
		data: {
			name: newName,
		},
	});

	// console.log(folder);
};

exports.deleteFolder = async (folderId) => {
	await prisma.folder.delete({
		where: {
			id: folderId,
		},
	});
};

// --- FILES LOGIC --

exports.getFiles = async (folderId) => {
	const files = await prisma.folder.findMany({
		where: {
			id: folderId,
		},
		include: {
			files: true,
		},
	});

	return files;
};
