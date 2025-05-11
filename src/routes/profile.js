const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('./../middlewares/auth');
const { UserModel } = require('./../models/user');
const { validateProfileEditData, validateNewPassword } = require('./../utils/validation');
const { logout } = require('../utils/commonLogic');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		if (!validateProfileEditData(req.body)) {
			throw new Error('Wrong data is not allowed to update!');
		}

		let userNewDetails = user;
		Object.keys(req.body).forEach((key) => {
			userNewDetails[key] = req.body[key];
		});

		await UserModel.findByIdAndUpdate(user._id, userNewDetails, { runValidators: true });
		res.send(userNewDetails.firstName + ' your profile is updated successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

profileRouter.patch('/profile/updatePassword', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		if (!validateNewPassword(req.body.password)) {
			throw new Error('New password is not strong enough to update!');
		}

		user.password = await bcrypt.hash(req.body.password, 10);

		await UserModel.findByIdAndUpdate(user._id, user, { runValidators: true });

		logout(res);
		res.send(user.firstName + ' your password is updated successfully. Please login again!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

module.exports = profileRouter;
