import Celebrate from 'celebrate';
const { celebrate, Joi, Segments } = Celebrate;

const validations = {
	register() {
		return celebrate({
			[Segments.BODY]: Joi.object().keys({
				fullName: Joi.string().required(),
				email: Joi.string().required(),
				password: Joi.string().required(),
			}),
		});
	},
	login() {
		return celebrate({
			[Segments.BODY]: Joi.object().keys({
				email: Joi.string().required(),
				password: Joi.string().required(),
			}),
		});
	},
	image() {
		return celebrate({
			[Segments.BODY]: Joi.object().keys({
				title: Joi.string().required(),
				description: Joi.string().required(),
				tags: Joi.string(),
				license: Joi.string().required(),
				credits: Joi.string(),
			}),
		});
	},
	album() {
		return celebrate({
			[Segments.BODY]: Joi.object().keys({
				name: Joi.string().required(),
				description: Joi.string().required(),
			}),
		});
	},
};

export default validations;
