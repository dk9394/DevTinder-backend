const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { connectDB } = require('./config/database');
const { UserModel } = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = 'DEV@Tinder$9394';

app.post('/signup', async (req, res) => {
	try {
		validateSignupData(req.body);
		const { firstName, lastName, emailId, password } = req.body;

		// Encrypt the password
		const passwordHash = await bcrypt.hash(password, 10);

		const user = new UserModel({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
		await user.save();
		res.send('User added successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await UserModel.findOne({ emailId });

		if (!user) {
			throw new Error('Invalid credentials!');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			// Create JWT token
			const jwtToken = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1h' });

			// Add the token to cookie and send the response back to the user
			res.cookie('token', jwtToken, { expires: '1h' });
			res.send(user.firstName + ' is logged in successfully!');
		} else {
			throw new Error('Invalid credentials!');
		}
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.patch('/user/:userId', userAuth, async (req, res) => {
	const newUserDetails = req.body;
	const userId = req.params.userId;
	const ALLOWED_UPDATES = ['firstName', 'lastName', 'age', 'gender', 'profileIconUrl', 'gallery', 'about', 'skills'];
	const isUpdateAllowed = Object.keys(user).every((key) => ALLOWED_UPDATES.includes(key));

	try {
		if (!isUpdateAllowed) {
			throw new Error('Wrong data is not allowed to update!');
		}
		await UserModel.findByIdAndUpdate(userId, newUserDetails, { runValidators: true });
		res.send('User updated successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get('/getUser/:userId', userAuth, async (req, res) => {
	const id = req.params.userId;

	try {
		const user = await UserModel.findOne({ _id: id });
		if (user) {
			res.send(user);
		} else {
			res.status(404).send('User not found with matching emailId: ' + userEmailId);
		}
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get('/getUsers', userAuth, async (req, res) => {
	const userName = req.body.firstName;

	try {
		const users = await UserModel.find({ firstName: userName });
		if (users.length) {
			res.send(users);
		} else {
			res.status(404).send('No user found matching: ' + userName);
		}
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get('/getAllUsers', userAuth, async (req, res) => {
	try {
		const users = await UserModel.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.delete('/user/:userId', userAuth, async (req, res) => {
	const id = req.params.userId;

	try {
		// const user = await UserModel.findByIdAndDelete({ _id: id });
		const user = await UserModel.findByIdAndDelete(id);
		res.send('User deleted successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

connectDB()
	.then(() => {
		console.log('Database connection established...');
		app.listen(3000, () => {
			console.log('Server is successfully listening on port 3000');
		});
	})
	.catch((err) => {
		console.log('Database cannot be connect!!');
	});
