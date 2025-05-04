const express = require('express');

const app = express();

// Make API enpoint
app.use('/hello', (req, res) => {
	res.send('Test');
});

// Make API enpoint
app.use('/', (req, res) => {
	res.send('Hello from the server!');
});

// Make server listen to the mentioned port - 3000
app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
