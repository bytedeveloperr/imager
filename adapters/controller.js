const controller = (requestHandler) => {
	return async (req, res, next) => {
		try {
			let response = await requestHandler(req);
			if (response.redirect) {
				return res.redirect(response.redirect.url || '/404');
			} else {
				return res.send(response.body);
			}
		} catch (e) {
			next(e);
		}
	};
};

export default controller;
