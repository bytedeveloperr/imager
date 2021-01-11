const loggedin = () => {
	return (req, res, next) => {
		if (!req.session.loggedin) {
			req.flash('error', 'You need to login to continue');
			return res.redirect('/login');
		} else {
			next();
		}
	};
};

export default loggedin;
