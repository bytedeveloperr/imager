import argon2 from 'argon2';
import cuid from 'cuid';
import Query from '../../database/Query.js';
import { UserEntity } from './index.js';

const User = new Query('users');

class UserService {
	async register(data) {
		let user,
			response = {},
			userExists = await User.findOne({ email: data.email });
		if (userExists) {
			response.error = 'Email already registered';
			return response;
		} else {
			data.password = await argon2.hash(data.password);
			data._id = cuid();
			user = new UserEntity(data);
			response.data = await User.save(user);
			return response;
		}
	}

	async login(data) {
		let response = {},
			user = await User.findOne({ email: data.email });
		if (user) {
			if (!(await argon2.verify(user.password, data.password))) {
				response.error = 'The password does not match the email';
				return response;
			} else {
				response.data = user;
				return response;
			}
		} else {
			response.error = 'Email is not registered';
			return response;
		}
	}

	async getUserById(_id) {
		let response = {},
			user = await User.findOne({ _id });
		if (!user) {
			response.error = 'User does not exist';
			return response;
		}
		response.data = user;
		return response;
	}
}

export default new UserService();
