const validator = require('validator');

const validateSignupData = (data) => {
	if (!data.firstName && !data.lastName) {
		throw new Error('FirstName or LastName is invalid!');
	}

	if (!validator.isEmail(data.emailId)) {
		throw new Error('Email address is invalid!');
	}

	if (!validator.isStrongPassword(data.password)) {
		throw new Error('Password is not strong enough!');
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
