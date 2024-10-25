const { PrismaClient } = require('@prisma/client');
const { name } = require('ejs');
const { urlencoded } = require('express');
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

exports.getFilesAndFolders = async (folderUser) => {
	const folder = await prisma.user.findFirst({
		where: {
			id: folderUser,
		},
		include: {
			folders: true,
		},
	});

	const files = await prisma.file.findMany({
		where: {
			userId: folderUser,
		},
	});

	return [folder.folders, files];
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

exports.getFolderContent = async (folderId, userId) => {
	const folderContent = await prisma.folder.findMany({
		where: {
			id: folderId,
		},
		include: {
			files: true,
		},
	});

	return folderContent;
};

// --- FILES LOGIC --

exports.addFile = async (file, publicUrl, user) => {
	await prisma.file.create({
		data: {
			name: file.originalname,
			url: publicUrl,
			size: file.size,
			fileType: file.mimetype,
			userId: user,
		},
	});
};

exports.getOneFile = async (fileId) => {
	const file = await prisma.file.findUnique({
		where: {
			id: fileId,
		},
	});

	return file;
};

exports.deleteFile = async (fileId) => {
	await prisma.file.delete({
		where: {
			id: fileId,
		},
	});
};
