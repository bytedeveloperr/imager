import { MainController } from '../app/main/index.js';
import { AuthController } from '../app/auth/index.js';
import { ImageController } from '../app/image/index.js';
import { AlbumController } from '../app/album/index.js';
import { controller } from '../adapters/index.js';
import { validations, loggedin, upload } from '../middleware/index.js';

const routes = (router) => {
	router.get('/', loggedin(), controller(MainController.index));
	router.get('/search', controller(MainController.search));
	router
		.route('/register')
		.get(controller(AuthController.register))
		.post(validations.register(), controller(AuthController.register));
	router
		.route('/login')
		.get(controller(AuthController.login))
		.post(validations.login(), controller(AuthController.login));
	router.route('/logout').get(controller(AuthController.logout));

	router
		.route('/image/upload')
		.get(loggedin(), controller(ImageController.upload))
		.post(
			loggedin(),
			upload.array('images', 1200000),
			controller(ImageController.upload)
		);
	router
		.route('/image/:imageId')
		.get(controller(ImageController.single))
		.put(loggedin(), controller(ImageController.update))
		.delete(loggedin(), controller(ImageController.delete));

	router
		.route('/album/create')
		.get(loggedin(), controller(AlbumController.create))
		.post(loggedin(), validations.album(), controller(AlbumController.create));
	router.route('/album/all').get(loggedin(), controller(AlbumController.fetch));
	router
		.route('/album/:albumId')
		.get(controller(AlbumController.single))
		.put(loggedin(), validations.album(), controller(AlbumController.update))
		.delete(loggedin(), controller(AlbumController.delete));
	router.post(
		'/album/clone/:albumId',
		loggedin(),
		controller(AlbumController.clone)
	);

	router.use('*', controller(MainController.page404));
	router.use((err, req, res, next) => {
		res.send();
	});

	return router;
};

export default routes;
