import expressSession from 'express-session';
import MongoStore from 'connect-mongodb-session';
import { database } from '../config/index.js';

const store = new MongoStore(expressSession)({
	uri: database.uri,
	collection: 'sessions',
});

const session = () => {
	return expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store,
	});
};

export default session;
