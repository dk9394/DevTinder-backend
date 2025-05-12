class MyError extends Error {
	constructor(data) {
		super(data.message);
		this.status = data.status;
		this.userMessage = data.userMessage || data.message;
	}
}

const sendErrorResponse = (res, err) => {
	if (err instanceof MyError) {
		return res.status(err.status).json({
			message: err.message,
			userMessage: err.userMessage,
			status: err.status,
		});
	} else {
		return res.status(500).json({
			message: err.message || 'Internal Server Error',
			userMessage: 'Something went wrong!',
			status: 500,
		});
	}
};

const sendSuccessResponse = (res, message, data) => {
	return res.status(200).json({
		message: message || 'Success',
		userMessage: message || 'Success',
		data: data,
		status: 200,
	});
};

module.exports = {
	MyError,
	sendErrorResponse,
	sendSuccessResponse,
};
