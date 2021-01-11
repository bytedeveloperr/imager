import expressSession from 'express-session';
import MongoStore from 'connect-mongodb-session';

const store = new MongoStore(expressSession)({
	uri: 'mongodb://localhost:27017/',
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
