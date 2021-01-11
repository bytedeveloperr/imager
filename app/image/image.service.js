import cuid from 'cuid';
import Query from '../../database/Query.js';
import { ImageEntity } from './index.js';
import { AlbumService } from '../album/index.js';
import { permissions } from '../../utils/index.js';
// import { UserService } from '../user/index.js';

const Image = new Query('images');

class ImageService {
	async upload(userId, images, album) {
		let response = {};
		images.forEach(async (image) => {
			image._id = cuid();
			album.images.push(image._id);
			image = new ImageEntity(image);
			if (!(await Image.save(image))) {
				response.error = 'An error occured when uploading images';
				return response;
			}
		});
		album = await AlbumService.create(userId, album);
		if (album.error) {
			response.error = album.error;
			return response;
		}
		response.data = image;
		return response;
	}

	async getImageActivities(loggedinUser) {
		let images = await Image.aggregate([
			{
				$sample: { size: 10 },
			},
			{ $match: { user: { $ne: loggedinUser } } },
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$lookup: {
					from: 'albums',
					localField: 'album',
					foreignField: 'name',
					as: 'album',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$unwind: '$album',
			},
		]);
		return images;
	}

	async getImageById(_id) {
		let images = await Image.aggregate([
			{ $match: { _id } },
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$lookup: {
					from: 'albums',
					localField: 'album',
					foreignField: 'name',
					as: 'album',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$unwind: '$album',
			},
		]);
		return images[0];
	}

	async getUserImages(user) {
		let images = await Image.aggregate([
			{ $match: { user } },
			{
				$lookup: {
					from: 'users',
					pipeline: [{ $project: { password: 0 } }],
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$lookup: {
					from: 'albums',
					localField: 'album',
					foreignField: 'name',
					as: 'album',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$unwind: '$album',
			},
		]);

		return images;
	}

	async updateImage(meta, data) {
		let response = {},
			image = await Image.findOne({ _id: meta.imageId }),
			user = { _id: meta.userId };
		if (!permissions.canUpdate(user, image)) {
			response.error = 'Permission denied';
			console.log(response.error);
			return response;
		}
		data.user = meta.userId;
		image = { ...image, ...data };
		image = new ImageEntity(image);
		if (await Image.updateOne({ _id: meta.imageId }, image)) {
			return response;
		}
	}

	async deleteImage(meta) {
		let response = {},
			image = await Image.findOne({ _id: meta.imageId }),
			user = { _id: meta.userId };
		if (!permissions.canDelete(user, image)) {
			response.error = 'Permission denied';
			console.log(response.error);
			return response;
		}
		if (await Image.remove({ _id: meta.imageId })) {
			return response;
		}
	}
}

export default new ImageService();
