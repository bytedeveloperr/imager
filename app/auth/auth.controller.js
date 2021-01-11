import { ejs } from '../../adapters/index.js';
import { UserService } from '../user/index.js';

class AuthController {
	async register(req) {
		let body,
			data = {
				title: 'Register',
				error: req.flash('error'),
			};
		switch (req.method) {
			case 'GET':
				body = await ejs.render('auth/register', data);
				return { body };
			case 'POST':
				let user = await UserService.register(req.body);
				if (user.error) {
					req.flash('error', user.error);
					return { redirect: { url: '/register' } };
				}
				req.session.loggedin = true;
				req.session.user = { _id: user.data._id, fullName: user.data.fullName };
				return { redirect: { url: '/' } };
		}
	}

	async login(req) {
		let body,
			data = {
				title: 'Login',
				error: req.flash('error'),
			};
		switch (req.method) {
			case 'GET':
				body = await ejs.render('auth/login', data);
				return { body };
			case 'POST':
				let user = await UserService.login(req.body);
				if (user.error) {
					req.flash('error', user.error);
					return { redirect: { url: '/login' } };
				}
				req.session.loggedin = true;
				req.session.user = { _id: user.data._id, fullName: user.data.fullName };
				return { redirect: { url: '/' } };
		}
	}

	async logout(req) {
		req.session.destroy();
		return { redirect: { url: '/login' } };
	}
}

export default new AuthController();
