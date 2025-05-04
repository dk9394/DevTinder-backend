const express = require('express');

const app = express();

// Make API enpoint
app.use('/test', (req, res) => {
	res.send('Test');
});

// This will handle GET method for /user
app.get('/user', (req, res) => {
	res.send({ name: 'Deepak' });
});

// This will handle POST method for /user
app.post('/user', (req, res) => {
	res.send('Data saved!');
});

// This will handle DELETE method for /user
app.delete('/user', (req, res) => {
	res.send('user deleted');
});

// The use method handle all matching routes regardsless of the HTTP method type (GET, POST, PUT, PATCH, DELETE)
// Order of endpoint routes is important - putting empty / in the last makes the pervious routes working
app.use('/', (req, res) => {
	res.send('Hello from the server!');
});

// Make server listen to the mentioned port - 3000
app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
