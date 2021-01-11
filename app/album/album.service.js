import cuid from 'cuid';
import Query from '../../database/Query.js';
import { AlbumEntity } from './index.js';
import { permissions } from '../../utils/index.js';

const Album = new Query('albums');

class AlbumService {
	async create(user, album) {
		let response = {},
			existingAlbum = await Album.findOne({ name: album.name });
		if (existingAlbum) {
			if (user !== existingAlbum.user) {
				response.error = 'Album name is not available';
				return response;
			}
			existingAlbum.images = [...existingAlbum.images, ...album.images];
			await Album.updateOne({ name: existingAlbum.name }, existingAlbum);
			return response;
		}
		album._id = cuid();
		album.user = user;
		album = new AlbumEntity(album);
		album = await Album.save(album);
		if (!album) {
			response.error = 'An error occured while creating album';
			return response;
		}
		response.data = album;
		return response;
	}

	async getUserAlbums(user) {
		let albums = await Album.aggregate([
			{ $match: { user } },
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
					from: 'images',
					localField: 'images',
					foreignField: '_id',
					as: 'images',
				},
			},
			{
				$unwind: '$user',
			},
		]);

		return albums;
	}

	async getAlbumActivities(loggedinUser) {
		let albums = await Album.aggregate([
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
				$unwind: '$user',
			},
		]);
		return albums;
	}

	async getAlbumById(_id) {
		let albums = await Album.aggregate([
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
					from: 'images',
					localField: 'images',
					foreignField: '_id',
					as: 'images',
				},
			},
			{
				$unwind: '$user',
			},
		]);
		return albums[0];
	}

	async updateAlbum(meta, data) {
		let response = {},
			album = await Album.findOne({ _id: meta.albumId }),
			user = { _id: meta.userId };
		if (!permissions.canUpdate(user, album)) {
			response.error = 'Permission denied';
			console.log(response.error);
			return response;
		}
		data.user = meta.userId;
		data.name = album.name;
		// album.images = [...existingAlbum.images, ...album.images];
		album = { ...album, ...data };
		album = new AlbumEntity(album);
		if (await Album.updateOne({ _id: meta.albumId }, album)) {
			return response;
		}
	}

	async deleteAlbum(meta) {
		let response = {},
			album = await Album.findOne({ _id: meta.albumId }),
			user = { _id: meta.userId };
		if (!permissions.canDelete(user, album)) {
			response.error = 'Permission denied';
			console.log(response.error);
			return response;
		}
		if (await Album.remove({ _id: meta.albumId })) {
			return response;
		}
	}
}

export default new AlbumService();
