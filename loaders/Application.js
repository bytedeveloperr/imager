import { Http } from './index.js';
import Express from './Express.js';

const express = new Express();
const http = new Http();
const server = http.server(express.app);

class Application {
	async run() {
		try {
			await server.listen(process.env.PORT);
		} catch (e) {
			throw e;
		}
	}
}

export default Application;
