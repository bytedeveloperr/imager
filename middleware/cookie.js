import cookieParser from 'cookie-parser';

const cookie = () => {
	return cookieParser(process.env.COOKIE_SECRET);
};

export default cookie;
