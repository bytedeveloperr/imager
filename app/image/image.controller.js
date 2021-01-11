import { ejs } from '../../adapters/index.js';
import { AlbumService } from '../album/index.js';
import { ImageService } from './index.js';

class ImageController {
	async upload(req) {
		let body,
			data = {
				title: 'Upload Image',
				loggedinUser: req.session.user,
				error: req.flash('error'),
			};
		switch (req.method) {
			case 'GET':
				data.albums = await AlbumService.getUserAlbums(req.session.user._id);
				body = await ejs.render('image/upload', data);
				return { body };
			case 'POST':
				let images = [];
				req.files.forEach((file) => {
					images.push({
						name: file.filename,
						path: file.path,
						mime: file.mimetype,
						size: file.size,
						title: req.body.title,
						tags: req.body.tags,
						license: req.body.license,
						credits: req.body.credits,
						description: req.body.description,
						user: req.session.user._id,
						album: req.body.album,
					});
				});

				let album = {
					name: req.body.album,
					description: req.body.description,
					user: req.session.user._id,
					images: [],
				};
				images = await ImageService.upload(req.session.user._id, images, album);
				if (images.error) {
					req.flash('error', images.error);
					return { redirect: { url: '/image/upload' } };
				}
				return { redirect: { url: '/' } };
		}
	}

	async single(req) {
		let body,
			image = await ImageService.getImageById(req.params.imageId),
			data = {
				title: 'Image',
				loggedinUser: req.session.user || {},
				error: req.flash('error'),
				image,
			};
		if (!image) {
			return { redirect: { url: '/404' } };
		}
		body = await ejs.render('image/single', data);

		return { body };
	}

	async update(req) {
		let meta = { userId: req.session.user._id, imageId: req.params.imageId };
		let response = await ImageService.updateImage(meta, req.body);
		if (response.error) {
			req.flash('error', response.error);
			return { redirect: { url: `/image/${meta.imageId}` } };
		}
		return { redirect: { url: `/image/${meta.imageId}` } };
	}

	async delete(req) {
		let meta = { userId: req.session.user._id, imageId: req.params.imageId };
		let response = await ImageService.deleteImage(meta);
		if (response.error) {
			req.flash('error', response.error);
			return { redirect: { url: `/image/${meta.imageId}` } };
		}
		return { redirect: { url: '/' } };
	}
}

export default new ImageController();
