const jwt = require('jsonwebtoken');

const { UserModel } = require('./../models/user');
const { SECRET_KEY } = require('./../utils/constants');
const { MyError, sendErrorResponse } = require('../utils/sendResponse');

const userAuth = async (req, res, next) => {
	try {
		// Read and verify the token
		const { token } = req.cookies;
		if (!token) {
			throw new MyError({
				status: 401,
				message: 'Token not found!',
				userMessage: 'Please login to continue!',
			});
		}
		const decodedJwt = await jwt.verify(token, SECRET_KEY);
		const { _id } = decodedJwt;

		if (!_id) {
			throw new MyError({
				status: 401,
				message: 'JWT expired!',
				userMessage: 'Please login to continue!',
			});
		}

		// Find the user
		const user = await UserModel.findById(_id);

		if (!user) {
			throw new MyError({
				status: 404,
				message: 'User not found!',
				userMessage: 'User not found! Please sign-up and continue!',
			});
		}

		// Attach user to the req object to make it available for the other request handlers
		req.authorizedUser = user;

		next();
	} catch (err) {
		sendErrorResponse(res, err);
	}
};

module.exports = {
	userAuth,
};
