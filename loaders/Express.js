import express from 'express';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import routes from '../routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { cookie, session } from '../middleware/index.js';

const app = express();
const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Express {
	constructor() {
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
		app.use(cookie());
		app.use(session());
		app.use(flash());
		app.use(methodOverride('_method'));
		app.use(routes(router));
	}

	get app() {
		return app;
	}
}

export default Express;
