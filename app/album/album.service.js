import cuid from 'cuid';
import Query from '../../database/Query.js';
import { AlbumEntity } from './index.js';
import { permissions } from '../../utils/index.js';

const Album = new Query('albums');
Album.getCollection().createIndex({ name: 'text', description: 'text' });

class AlbumService {
	async create(user, album) {
		let response = {},
			existingAlbum = await Album.findOne({ _id: album._id });
		if (existingAlbum) {
			if (user !== existingAlbum.user) {
				response.error = 'Unable to upload to this album';
				return response;
			}
			existingAlbum.images = [...existingAlbum.images, ...album.images];
			await Album.updateOne({ _id: existingAlbum._id }, existingAlbum);
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

	async clone(user, albumId) {
		let response = {},
			album = await Album.findOne({ _id: albumId });
		if (!album) {
			response.error = "The album you're trying to clone does not exists";
			return response;
		}
		album._id = cuid();
		album.user = user;
		album.type = 'clone';
		album.clone = albumId;
		console.log('album');
		album = new AlbumEntity(album);
		album = await Album.save(album);
		if (!album) {
			response.error = 'An error occured while cloning album, please try again';
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
		// data.name = album.name;
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

	async searchAlbums(text) {
		let albums = await Album.aggregate([
			{
				$match: { $text: { $search: text } },
			},
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
}

export default new AlbumService();
