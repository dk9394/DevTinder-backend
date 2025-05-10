const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('./../middlewares/auth');
const { UserModel } = require('./../models/user');
const { validateProfileEditData, validateNewPassword } = require('./../utils/validation');

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

		const userNewDetails = Object.assign({}, user, req.body);

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
		res.send(user.firstName + ' your password is updated successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

module.exports = profileRouter;
