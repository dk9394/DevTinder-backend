const express = require('express');

const { connectDB } = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
	const user = new UserModel(req.body);

	try {
		await user.save();
		res.send('User added successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.patch('/user/:userId', async (req, res) => {
	const user = req.body;
	const userId = req.params.userId;
	const ALLOWED_UPDATES = ['firstName', 'lastName', 'age', 'gender', 'profileIconUrl', 'gallery', 'about', 'skills'];
	const isUpdateAllowed = Object.keys(user).every((key) => ALLOWED_UPDATES.includes(key));

	try {
		if (!isUpdateAllowed) {
			throw new Error('Wrong data is not allowed to update!');
		}
		await UserModel.findByIdAndUpdate(userId, user, { runValidators: true });
		res.send('User updated successfully!');
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.get('/getUser/:userId', async (req, res) => {
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

app.get('/getUsers', async (req, res) => {
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

app.get('/getAllUsers', async (req, res) => {
	try {
		const users = await UserModel.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

app.delete('/user/:userId', async (req, res) => {
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
