import { ejs } from '../../adapters/index.js';
import { ImageService } from '../image/index.js';
import { AlbumService } from '../album/index.js';

class MainController {
	async index(req) {
		let body,
			data = {
				title: 'Home',
				loggedinUser: req.session.user,
				userAlbums: await AlbumService.getUserAlbums(req.session.user._id),
				publicAlbums: await AlbumService.getAlbumActivities(
					req.session.user._id
				),
				publicImages: await ImageService.getImageActivities(
					req.session.user._id
				),
			};
		body = await ejs.render('index', data);
		return { body };
	}

	async page404(req) {
		let body,
			data = {
				title: 'Home',
			};
		body = await ejs.render('extras/404', data);
		return { body };
	}

	async search(req) {
		let body,
			data = {
				title: 'Search results',
				loggedinUser: req.session.user || {},
				images: null,
				albums: null,
			};
		if (req.query.find) {
			switch (req.query.find) {
				case 'images':
					data.images = await ImageService.searchImages(req.query.q);
					break;
				case 'albums':
					data.albums = await AlbumService.searchAlbums(req.query.q);
					break;
			}
		} else {
			data.albums = await AlbumService.searchAlbums(req.query.q);
			data.images = await ImageService.searchImages(req.query.q);
		}
		body = await ejs.render('main/search', data);
		return { body };
	}
}

export default new MainController();
