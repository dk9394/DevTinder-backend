const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('./../utils/constants');
const { logout } = require('./../utils/commonLogic');
const { UserModel } = require('./../models/user');
const { MyError, sendErrorResponse, sendSuccessResponse } = require('../utils/sendResponse');
// const { validateSignupData } = require('./../utils/validation');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		// This type of helper functions can be used to validate req.body to have extra layer of safety
		// validateSignupData(req.body);

		const { firstName, lastName, emailId, password } = req.body;

		// Encrypt the password
		const passwordHash = await bcrypt.hash(password, 10);

		const user = new UserModel({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});

		await user.save();
		sendSuccessResponse(res, 'User added successfully!', user);
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

authRouter.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await UserModel.findOne({ emailId });

		if (!user) {
			throw new MyError({
				status: 404,
				message: 'Invalid credentials!',
				userMessage: 'Invalid credentials!',
			});
		}

		// You can leverage the Schema methods to validate or create JWT token kind of tasks to offload from the API request handler.
		// const isPasswordValid = await user.validatePassword(password);

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			// Create JWT token by leveraging the Schema methods to offload this request handler
			// const jwtToken = await user.getJWT();

			// Create JWT token
			const jwtToken = await jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });

			// Add the token to cookie and send the response back to the user
			res.cookie('token', jwtToken, { expires: new Date(Date.now() + 60 * 60 * 1000) });
			sendSuccessResponse(res, `${user.firstName} is logged in successfully!`, user);
		} else {
			throw new MyError({
				status: 404,
				message: 'Invalid credentials!',
				userMessage: 'Invalid credentials!',
			});
		}
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

authRouter.post('/logout', (req, res) => {
	logout(res);
	sendSuccessResponse(res, 'Logged-out successfully!');
});

module.exports = authRouter;
