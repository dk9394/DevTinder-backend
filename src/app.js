const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { connectDB } = require('./config/database');

const app = express();

app.use(
	cors({
		origin: 'http://localhost:4200', // Replace with your Angular app's URL
		credentials: true, // Allow cookies to be sent with requests
	})
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// app.get('/getUser/:userId', userAuth, async (req, res) => {
// 	const id = req.params.userId;

// 	try {
// 		const user = await UserModel.findOne({ _id: id });
// 		if (user) {
// 		sendSuccessResponse(res, 'user', user);
// 		} else {
// 			res.status(404).send('User not found with matching emailId: ' + userEmailId);
// 		}
// 	} catch (err) {
// 		sendErrorResponse(res, err);
// 	}
// });

// app.get('/getUsers', userAuth, async (req, res) => {
// 	const userName = req.body.firstName;

// 	try {
// 		const users = await UserModel.find({ firstName: userName });
// 		if (users.length) {
// 			sendSuccessResponse(res, 'users', users);
// 		} else {
// 			res.status(404).send('No user found matching: ' + userName);
// 		}
// 	} catch (err) {
// 		sendErrorResponse(res, err);
// 	}
// });

// app.get('/getAllUsers', userAuth, async (req, res) => {
// 	try {
// 		const users = await UserModel.find({});
// 		sendSuccessResponse(res, 'users', users);
// 	} catch (err) {
// 		sendErrorResponse(res, err);
// 	}
// });

// app.delete('/user/:userId', userAuth, async (req, res) => {
// 	const id = req.params.userId;

// 	try {
// 		// const user = await UserModel.findByIdAndDelete({ _id: id });
// 		const user = await UserModel.findByIdAndDelete(id);
// 		sendSuccessResponse(res, 'User deleted successfully!', user);
// 	} catch (err) {
// 		sendErrorResponse(res, err);
// 	}
// });

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
