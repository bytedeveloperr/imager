import { ImageController } from '../app/image/index.js';
import { controller } from '../adapters/index.js';
import { validations, loggedin, upload } from '../middleware/index.js';

const routes = (router) => {
	router
		.route('/upload')
		.get(loggedin(), controller(ImageController.upload))
		.post(
			loggedin(),
			upload.array('images', 12),
			controller(ImageController.upload)
		);

	router
		.route('/i/:imageId')
		.get(controller(ImageController.single))
		.put(loggedin(), controller(ImageController.update))
		.delete(loggedin(), controller(ImageController.delete));

	return router;
};

export default routes;
