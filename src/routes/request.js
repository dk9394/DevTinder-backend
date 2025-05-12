const express = require('express');

const { userAuth } = require('./../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const { UserModel } = require('../models/user');
const { MyError, sendErrorResponse, sendSuccessResponse } = require('../utils/sendResponse');

const requestRouter = express.Router();

const ALL_STATUS = ['ignored', 'interested', 'accepted', 'rejected'];

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
	try {
		const fromUserId = req.authorizedUser._id;
		const toUserId = req.params.toUserId;
		const status = req.params.status;

		const allowedStatus = ALL_STATUS.slice(0, 2);
		if (!allowedStatus.includes(status)) {
			throw new MyError({
				status: 404,
				message: 'Invalid status type!',
				userMessage: 'Invalid status type!',
			});
		}

		const toUser = await UserModel.findById(toUserId);
		const isToUserAvailable = !!toUser;
		if (!isToUserAvailable) {
			throw new MyError({
				status: 404,
				message: 'User not found!',
				userMessage: 'User not found!',
			});
		}

		const isConnectionRequestAlreadyExist = await ConnectionRequestModel.findOne({
			$or: [
				{ fromUserId, toUserId },
				{ fromUserId: toUserId, toUserId: fromUserId },
			],
		});
		if (isConnectionRequestAlreadyExist) {
			throw new MyError({
				status: 404,
				message: 'There is a connection request already existing!',
				userMessage: 'There is a connection request already existing!',
			});
		}

		const connectionRequest = new ConnectionRequestModel({
			fromUserId,
			toUserId,
			status,
		});

		const data = await connectionRequest.save(connectionRequest);
		sendSuccessResponse(
			res,
			status === allowedStatus[0]
				? `You ${allowedStatus[0]} ${toUser.firstName}`
				: `You are ${allowedStatus[1]} in ${toUser.firstName}`,
			data
		);
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;
		const { status, requestId } = req.params;

		const allowedStatus = ALL_STATUS.slice(2, 4);
		if (!allowedStatus.includes(status)) {
			throw new MyError({
				status: 404,
				message: 'Invalid status type!',
				userMessage: 'Invalid status type!',
			});
		}

		const connectionRequest = await ConnectionRequestModel.findOne({
			_id: requestId,
			toUserId: user._id,
			status: ALL_STATUS[1],
		});
		if (!connectionRequest) {
			throw new MyError({
				status: 404,
				message: 'Connection request not found!',
				userMessage: 'Connection request not found!',
			});
		}

		connectionRequest.status = status;

		const data = await connectionRequest.save();
		sendSuccessResponse(res, `Connection request is ${connectionRequest.status}`, data);
	} catch (err) {
		sendErrorResponse(res, err);
	}
});

module.exports = requestRouter;
