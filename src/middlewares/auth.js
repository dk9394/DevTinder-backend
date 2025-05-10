const jwt = require('jsonwebtoken');

const { UserModel } = require('./../models/user');
const { SECRET_KEY } = require('./../utils/constants');

const userAuth = async (req, res, next) => {
	try {
		// Read and verify the token
		const { token } = req.cookies;
		if (!token) {
			throw new Error('Token is not found!');
		}
		const decodedJwt = await jwt.verify(token, SECRET_KEY);
		const { _id } = decodedJwt;

		if (!_id) {
			throw new Error('JWT expired!');
		}

		// Find the user
		const user = await UserModel.findById(_id);

		if (!user) {
			throw new Error('User not found!');
		}

		// Attach user to the req object to make it available for the other request handlers
		req.authorizedUser = user;

		next();
	} catch (err) {
		res.status(400).send(err.message);
	}
};

module.exports = {
	userAuth,
};
