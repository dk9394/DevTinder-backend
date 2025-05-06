const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'DEV@Tinder$9394';

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			minLength: 3,
			maxLength: 50,
		},
		lastName: {
			type: String,
			trim: true,
			minLength: 3,
			maxLength: 50,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email address: ' + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error('Not a strong password: ' + value);
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!['male', 'female', 'others'].includes(value)) {
					throw new Error('Gender is not valid!');
				}
			},
		},
		profileIconUrl: {
			type: String,
			default: 'https://www.pngfind.com/pngs/m/665-6650067_business-man-signo-de-estudiantes-hd-png-download.png',
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error('Invalid image URL: ' + value);
				}
			},
		},
		gallery: {
			type: [String],
			default: [],
			validate(value) {
				if (!value.every((val) => validator.isUrl(val))) {
					throw new Error('One or more invalid gallery image URL');
				}
			},
		},
		about: {
			type: String,
			trim: true,
			minLength: 6,
			maxLength: 100,
		},
		skills: {
			type: [String],
			validate(value) {
				if (value.length > 10) {
					throw new Error('More than 10 skills are not allowed!');
				}
			},
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.getJWT = async function () {
	const user = this;

	const jwtToken = await jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });

	return jwtToken;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;

	const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);

	return isPasswordValid;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = {
	UserModel,
};
