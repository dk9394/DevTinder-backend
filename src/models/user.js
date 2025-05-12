const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const { MyError } = require('../utils/sendResponse');

// const SECRET_KEY = 'DEV@Tinder$9394';

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
					throw new MyError({
						status: 422,
						message: 'Invalid email address!' + value,
						userMessage: 'Invalid email address!',
					});
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new MyError({
						status: 422,
						message: 'Not a strong password: ' + value,
						userMessage: 'Not a strong password: ' + value,
					});
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
					throw new MyError({
						status: 422,
						message: 'Gender is not valid: ' + value,
						userMessage: 'Gender is not valid: ' + value,
					});
				}
			},
		},
		profileIconUrl: {
			type: String,
			default: 'https://www.pngfind.com/pngs/m/665-6650067_business-man-signo-de-estudiantes-hd-png-download.png',
			validate(value) {
				if (!validator.isURL(value)) {
					throw new MyError({
						status: 422,
						message: 'Invalid image URL: ' + value,
						userMessage: 'Invalid image URL',
					});
				}
			},
		},
		gallery: {
			type: [String],
			default: [],
			validate(value) {
				if (!value.every((val) => validator.isUrl(val))) {
					throw new MyError({
						status: 422,
						message: 'One or more invalid image URL(s)',
						userMessage: 'One or more invalid gallery image URL(s)',
					});
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
					throw new MyError({
						status: 422,
						message: 'More than 10 skills are not allowed!',
						userMessage: 'More than 10 skills are not allowed!',
					});
				}
			},
		},
	},
	{
		timestamps: true,
	}
);

// userSchema.methods.getJWT = async function () {
// 	const user = this;

// 	const jwtToken = await jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });

// 	return jwtToken;
// };

// userSchema.methods.validatePassword = async function (passwordInputByUser) {
// 	const user = this;

// 	const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);

// 	return isPasswordValid;
// };

const UserModel = mongoose.model('User', userSchema);

module.exports = {
	UserModel,
};
