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

module.exports = {
	validateSignupData,
};
