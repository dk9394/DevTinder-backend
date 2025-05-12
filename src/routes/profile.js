const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('./../middlewares/auth');
const { UserModel } = require('./../models/user');
const { validateProfileEditData, validateNewPassword } = require('./../utils/validation');
const { logout } = require('../utils/commonLogic');
const { MyError, sendErrorResponse, sendSuccessResponse } = require('../utils/sendResponse');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		sendSuccessResponse(res, 'User found!', user);
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		if (!validateProfileEditData(req.body)) {
			throw new MyError({
				status: 422,
				message: 'Wrong data is not allowed to update!',
				userMessage: 'Wrong data is not allowed to update!',
			});
		}

		let userNewDetails = user;
		Object.keys(req.body).forEach((key) => {
			userNewDetails[key] = req.body[key];
		});

		await UserModel.findByIdAndUpdate(user._id, userNewDetails, { runValidators: true });
		sendSuccessResponse(res, `${userNewDetails.firstName}, your profile is updated successfully!`, userNewDetails);
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

profileRouter.patch('/profile/updatePassword', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		if (!validateNewPassword(req.body.password)) {
			throw new MyError({
				status: 422,
				message: 'New password is not strong enough to update!',
				userMessage: 'New password is not strong enough to update!',
			});
		}

		user.password = await bcrypt.hash(req.body.password, 10);

		await UserModel.findByIdAndUpdate(user._id, user, { runValidators: true });

		logout(res);
		sendSuccessResponse(res, 'Password updated successfully. Please login again!');
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

module.exports = profileRouter;
