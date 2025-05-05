const express = require('express');

const app = express();

app.post('/admin', (req, res) => {
	// Some other logic
	res.send('Admin data sent!');
});

app.post('/user/login', (req, res) => {
	try {
		res.send('User is logged in successfully!');
	} catch (err) {
		res.status(500).send('User is not logged in. Something went wrong!');
	}
});

// This middleware in last of the code will work as safe guard of any kind of error that might not be handled properly anywhere in the code.
// For example in the /admin request handler the error is not handled if may occur, because the code is not written in try catch block.
app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('Something went wrong!');
	}
});

app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
