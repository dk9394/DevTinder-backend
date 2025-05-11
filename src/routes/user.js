const express = require('express');

const { userAuth } = require('./../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const { ALL_STATUS } = require('./../utils/constants');
const { UserModel } = require('../models/user');

const userRouter = express.Router();

const REQUESTED_USERS_PROFILE_DETAILS = ['firstName', 'lastName', 'age', 'about', 'profileIconUrl', 'skills', 'gender'];

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		const connectionRequests = await ConnectionRequestModel.find({
			toUserId: user._id,
			status: ALL_STATUS[1],
		}).populate('fromUserId', REQUESTED_USERS_PROFILE_DETAILS);

		res.send(connectionRequests);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// userRouter.get('/user/requests/sent', userAuth, async (req, res) => {
// 	try {
// 		const user = req.authorizedUser;

// 		const connectionRequests = await ConnectionRequestModel.find({
// 			fromUserId: user._id,
// 		}).populate('fromUserId');

// 		res.send(connectionRequests);
// 	} catch (err) {
// 		res.status(400).send(err.message);
// 	}
// });

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		const connectionRequests = await ConnectionRequestModel.find({
			$or: [
				{ toUserId: user._id, status: ALL_STATUS[2] },
				{ fromUserId: user._id, status: ALL_STATUS[2] },
			],
		})
			.populate('fromUserId', REQUESTED_USERS_PROFILE_DETAILS)
			.populate('toUserId', REQUESTED_USERS_PROFILE_DETAILS);

		const data = connectionRequests.map((connection) => {
			if (connection.fromUserId._id.toString() === user._id.toString()) {
				return connection.toUserId;
			}
			return connection.fromUserId;
		});

		res.json({ data });
	} catch (err) {
		res.status(400).send(err.message);
	}
});

userRouter.get('/feeds', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 30 ? 30 : limit;

		const connectionRequests = await ConnectionRequestModel.find({
			$or: [{ fromUserId: user._id }, { toUserId: user._id }],
		}).select(['fromUserId', 'toUserId']);

		const hiddenUsersFromFeed = new Set();

		connectionRequests.forEach((connection) => {
			hiddenUsersFromFeed.add(connection.fromUserId.toString());
			hiddenUsersFromFeed.add(connection.toUserId.toString());
		});

		const feed = await UserModel.find({
			$and: [{ _id: { $nin: Array.from(hiddenUsersFromFeed) } }, { _id: { $ne: user._id } }],
		})
			.select(REQUESTED_USERS_PROFILE_DETAILS)
			.skip((page - 1) * limit)
			.limit(limit);

		res.json({ data: feed });
	} catch (err) {
		res.status(400).send(err.message);
	}
});

module.exports = userRouter;
