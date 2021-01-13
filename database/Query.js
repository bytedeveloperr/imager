import { db } from './index.js';

class Query {
	constructor(collection) {
		this.collection = db.collection(collection);
	}

	getCollection() {
		return this.collection;
	}

	async save(data, options = {}) {
		data = await this.collection.insertOne(data, options);
		if (data.insertedId) {
			return this.findOne({ _id: data.insertedId });
		}
		return null;
	}

	async find(query, options = {}) {
		let data = await this.collection.find(query, options);
		return data.toArray();
	}

	async findOne(query, options = {}) {
		let data = await this.collection.findOne(query, options);
		return data;
	}

	async updateOne(query, data, options = {}) {
		data = await this.collection.updateOne(query, { $set: data }, options);
		return data;
	}

	async aggregate(query) {
		let data = await this.collection.aggregate(query);
		return data.toArray();
	}

	async remove(query, options = {}) {
		return await this.collection.remove(query);
	}
}

export default Query;
