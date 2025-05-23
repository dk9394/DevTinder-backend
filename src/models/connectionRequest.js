const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ['ignored', 'interested', 'accepted', 'rejected'],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Check if fromUserId and toUserId are same

// connectionRequestSchema.pre('save', function () {
// 	const connectionRequest = this;

// 	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
// 		throw new MyError({
// 			status: 404,
// 			message: 'Connection request cannot be send to yourself!',
// 			userMessage: 'Connection request cannot be send to yourself!',
// 		});
// 	}

// 	next();
// });

const ConnectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;
