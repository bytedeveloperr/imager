import { ejs } from '../../adapters/index.js';
import { AlbumService } from './index.js';

class AlbumController {
	async create(req) {
		let body,
			data = {
				title: 'Album',
				loggedinUser: req.session.user || {},
				error: req.flash('error'),
			};
		switch (req.method) {
			case 'GET':
				body = await ejs.render('album/create', data);
				return { body };
			case 'POST':
				let album = await AlbumService.create(req.session.user._id, req.body);
				if (album.error) {
					req.flash('error', album.error);
					return { redirect: { url: `/album/create` } };
				}
				return { redirect: { url: `/album/${album.data._id}` } };
		}
	}

	async fetch(req) {
		let body,
			albums = await AlbumService.getUserAlbums(req.session.user._id),
			data = {
				title: 'Album',
				loggedinUser: req.session.user || {},
				albums,
			};
		body = await ejs.render('album/all', data);
		return { body };
	}

	async single(req) {
		let body,
			album = await AlbumService.getAlbumById(req.params.albumId),
			data = {
				title: 'Album',
				loggedinUser: req.session.user || {},
				error: req.flash('error'),
				album,
			};
		if (!album) {
			return { redirect: { url: '/404' } };
		}
		body = await ejs.render('album/single', data);
		return { body };
	}

	async update(req) {
		let meta = { userId: req.session.user._id, albumId: req.params.albumId };
		let response = await AlbumService.updateAlbum(meta, req.body);
		if (response.error) {
			req.flash('error', response.error);
			return { redirect: { url: `/album/${meta.albumId}` } };
		}
		return { redirect: { url: `/album/${meta.albumId}` } };
	}

	async delete(req) {
		let meta = { userId: req.session.user._id, albumId: req.params.albumId };
		let response = await AlbumService.deleteAlbum(meta);
		if (response.error) {
			req.flash('error', response.error);
			return { redirect: { url: `/album/${meta.albumId}` } };
		}
		return { redirect: { url: '/' } };
	}
}

export default new AlbumController();
