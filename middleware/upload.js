import cuid from 'cuid';
import path from 'path';
import Multer from 'multer';

const multer = Multer({
	storage: Multer.diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			let filename = `${file.originalname}-${cuid()}${path.extname(
				file.originalname
			)}`;
			cb(null, filename);
		},
	}),

	fileFilter: (req, file, cb) => {
		let mimes = ['image/jpg', 'image/jpeg', 'image/png'];
		if (!mimes.includes(file.mimetype)) {
			cb(new Error('File type not supported'));
		} else {
			cb(null, true);
		}
	},
});

const upload = {
	array(field, max = 4) {
		return multer.array(field, max);
	},
};

export default upload;
