const express = require('express');

const app = express();

// Make API enpoint
app.use('/hello', (req, res) => {
	res.send('Test');
});

// Order of endpoint routes is important - putting empty / in the last makes the pervious routes working
app.use('/', (req, res) => {
	res.send('Hello from the server!');
});

// Make server listen to the mentioned port - 3000
app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
