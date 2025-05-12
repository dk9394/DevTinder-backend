const validator = require('validator');

const { MyError } = require('./sendResponse');

const validateSignupData = (data) => {
	if (!data.firstName && !data.lastName) {
		throw new MyError({
			status: 422,
			message: 'FirstName or LastName is invalid!',
			userMessage: 'FirstName or LastName is invalid!',
		});
	}

	if (!validator.isEmail(data.emailId)) {
		throw new MyError({
			status: 422,
			message: 'Email address is invalid!',
			userMessage: 'Email address is invalid!',
		});
	}

	if (!validator.isStrongPassword(data.password)) {
		throw new MyError({
			status: 422,
			message: 'Password is not strong enough!',
			userMessage: 'Password is not strong enough!',
		});
	}
};

const validateProfileEditData = (data) => {
	const userNewDetails = data;
	const ALLOWED_UPDATES = ['firstName', 'lastName', 'age', 'gender', 'profileIconUrl', 'gallery', 'about', 'skills'];
	return Object.keys(userNewDetails).every((key) => ALLOWED_UPDATES.includes(key));
};

const validateNewPassword = (data) => {
	return validator.isStrongPassword(data);
};

module.exports = {
	validateSignupData,
	validateProfileEditData,
	validateNewPassword,
};
