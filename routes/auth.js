import { AuthController } from '../app/auth/index.js';
import { controller } from '../adapters/index.js';
import { validations } from '../middleware/index.js';

const routes = (router) => {
	router
		.route('/register')
		.get(controller(AuthController.register))
		.post(validations.register(), controller(AuthController.register));
	router
		.route('/login')
		.get(controller(AuthController.login))
		.post(validations.login(), controller(AuthController.login));
	router.route('/logout').get(controller(AuthController.logout));

	return router;
};

export default routes;
