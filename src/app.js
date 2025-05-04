const express = require('express');

const app = express();

/**
 * Routes pattern
 *
 * The ? makes anything after it optional
 * The + allows repeating anything which is followed by it
 * The * allows anything random in between in place of it
 * The () makes optional which is in between it
 * RegEx is also allowed instead of plain string values as route
 */

// Here, /ab, /abc both will work
// app.get('/ab?c', (req, res) => {
// 	res.send({ name: 'Deepak' });
// });

// Here, repeating b is allowed, /abbbbbbbc, /abc both will work
// app.get('/ab+c', (req, res) => {
// 	res.send({ name: 'Deepak' });
// });

// Here, /abcd, /abXYZcd both will work
// app.get('/ab*cd', (req, res) => {
// 	res.send({ name: 'Deepak' });
// });

// Here, /ad, /abcd both will work, because bc is optional in the route
// app.get('/a(bc)d', (req, res) => {
// 	res.send({ name: 'Deepak' });
// });

// Here, bc is optional as well as repeatable, /ad, /abcd, /abcbcbcd all will work
// app.get('/a(bc)+d', (req, res) => {
// 	res.send({ name: 'Deepak' });
// });

/**
 * Route query params and dynamic routes
 */

// The query params are passed using, ?key=val&key=val pattern. Here & is used for more than 1 query param
// Example: /user?userId=101&pwd=test
app.get('/user', (req, res) => {
	// Accessing the query params for the specific route
	console.log(req.query);
	res.send({ name: 'Deepak' });
});

// The dynamic routes are used like this, /user/101/Deepak/xyz pattern.
// Here every dynamic route value will be captured by the defined key in the route
app.get('/user/:userId/:name/:pwd', (req, res) => {
	// Accessing dynamic route values for the specific route
	console.log(req.params);
	console.log(req.query);
	res.send({ name: 'Deepak' });
});

app.listen(3000, () => {
	console.log('Server is successfully listening on port 3000');
});
