const { PrismaClient } = require('@prisma/client');

function formatBytes(number, decimals = 2) {
	let bytes = Number(number);

	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [
		'Bytes',
		'KiB',
		'MiB',
		'GiB',
		'TiB',
		'PiB',
		'EiB',
		'ZiB',
		'YiB',
	];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const extendedFile = new PrismaClient().$extends({
	result: {
		file: {
			trueName: {
				needs: {
					name: true,
				},
				compute(file) {
					return `${file.name.replace(/\.[^/.]+$/, '')}`;
				},
			},
			trueSize: {
				needs: { size: true },
				compute(file) {
					const result = formatBytes(file.size);
					return `${result}`;
				},
			},
			formattedDate: {
				needs: {
					createdAt: true,
				},
				compute(file) {
					return `${file.createdAt.toLocaleString()}`;
				},
			},
		},
	},
});

module.exports = extendedFile;
