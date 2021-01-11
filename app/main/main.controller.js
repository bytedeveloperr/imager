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
}

export default new MainController();
