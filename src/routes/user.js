const express = require('express');

const { userAuth } = require('./../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const { ALL_STATUS } = require('./../utils/constants');

const userRouter = express.Router();

userRouter.get('/user/receivedRequests', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;

		const connectionRequests = await ConnectionRequestModel.find({
			toUserId: user._id,
			status: ALL_STATUS[1],
		});

		res.send(connectionRequests);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

module.exports = userRouter;
