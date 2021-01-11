import mongodb from 'mongodb';
import { database } from '../config/index.js';

let db,
	client,
	options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	{ MongoClient } = mongodb;

try {
	client = await MongoClient.connect(database.uri, options);
	db = client.db(database.name);
} catch (e) {
	throw e;
}

export { db };
