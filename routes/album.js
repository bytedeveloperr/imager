import { AlbumController } from '../app/album/index.js';
import { controller } from '../adapters/index.js';
import { loggedin, validations } from '../middleware/index.js';

const routes = (router) => {
	router
		.route('/create')
		.get(loggedin(), controller(AlbumController.create))
		.post(loggedin(), validations.album(), controller(AlbumController.create));

	router
		.route('/a/:albumId')
		.get(controller(AlbumController.single))
		.put(loggedin(), validations.album(), controller(AlbumController.update))
		.delete(loggedin(), controller(AlbumController.delete));

	return router;
};

export default routes;
