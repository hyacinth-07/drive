const { PrismaClient } = require('@prisma/client');
const { name } = require('ejs');
const { urlencoded } = require('express');
const prisma = new PrismaClient();
const extendedFile = require('./prisma_extensions');

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

	const files = await extendedFile.file.findMany({
		where: {
			userId: folderUser,
			folderId: null,
		},
		select: {
			trueName: true,
			trueSize: true,
			formattedDate: true,
			fileType: true,
			id: true,
		},
	});

	return [folder.folders, files];
};

exports.getFolders = async (userId) => {
	const folder = await prisma.folder.findMany({
		where: {
			userId: userId,
		},
	});

	return folder;
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

exports.getFolderContent = async (folderId) => {
	const folderContent = await extendedFile.file.findMany({
		where: {
			folderId: folderId,
		},
		select: {
			trueName: true,
			trueSize: true,
			formattedDate: true,
			fileType: true,
			id: true,
			userId: true,
		},
	});

	return folderContent;
};

// --- FILES LOGIC --

exports.addFile = async (file, publicUrl, user, folderName) => {
	if (folderName == 'null') {
		await prisma.file.create({
			data: {
				name: file.originalname,
				url: publicUrl,
				size: file.size,
				fileType: file.mimetype,
				userId: user,
			},
		});
	} else {
		await prisma.file.create({
			data: {
				name: file.originalname,
				url: publicUrl,
				size: file.size,
				fileType: file.mimetype,
				userId: user,
				folderId: folderName,
			},
		});
	}
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
