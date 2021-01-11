import view from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const ejs = {
	async render(file, option = {}) {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));

		return await view.renderFile(
			path.join(__dirname, `../presentation/views/${file}.ejs`),
			option
		);
	},
};

export default ejs;
