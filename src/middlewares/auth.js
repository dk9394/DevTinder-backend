// Handle Auth Middleware for all type of HTTP methods - GET, POST, PUT, PATCH, DELETE
const adminAuth = (req, res, next) => {
	console.log('Admin auth is getting checked!');
	const token = 'xyz';
	const isAdminAuthorized = token === 'xyz';
	if (!isAdminAuthorized) {
		res.status(401).send('Unauthorized request!');
	} else {
		next();
	}
};

// Handle Auth Middleware for all type of HTTP methods - GET, POST, PUT, PATCH, DELETE
const userAuth = (req, res, next) => {
	console.log('User auth is getting checked!');
	const token = 'xyz';
	const isUserAuthorized = token === 'xyz';
	if (!isUserAuthorized) {
		res.status(401).send('Unauthorized request!');
	} else {
		next();
	}
};

module.exports = {
	adminAuth,
	userAuth,
};
