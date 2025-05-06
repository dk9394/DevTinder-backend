const express = require('express');

const { connectDB } = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();

app.post('/signup', async (req, res) => {
	const user = new UserModel({
		firstName: 'Deepak',
		lastName: 'Kumar',
		emailId: 'k.deepak9394@gmail.com',
		password: 'devTinder@9394',
		age: 35,
		gender: 'male',
	});

	try {
		await user.save();
		res.send('User added successfully!');
	} catch (err) {
		res.status(400).send('Error saving the user: ', err.message);
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
