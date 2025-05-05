const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

// Check Admin auth by using use method for all type of HTTP methods before proceeding to the next request handlers of the same route.
app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res) => {
	res.send('All Data sent');
});

app.get('/admin/delete/:userId', (req, res) => {
	const userId = req.params.userId;
	res.send(`User with the id ${userId} is deleted!`);
});

// Another way of using middleware by putting directly in the request handler
app.get('/user', userAuth, (req, res) => {
	res.send('User data sent!');
});

// Here user is not required at the time of user login obviously. So userAuth middleware is not used in the request handler.
app.post('/user/login', (req, res) => {
	res.send('User is logged in successfully!');
});

app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
