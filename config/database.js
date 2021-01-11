const database = {
	uri: process.env.DB_URI || 'mongodb://localhost:27017',
	name: process.env.DB_NAME || 'imager',
};

export default database;
