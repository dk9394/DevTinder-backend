const express = require('express');

const { userAuth } = require('./../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
	try {
		const user = req.authorizedUser;
	} catch (err) {
		res.status(400).send(err.message);
	}
});

module.exports = requestRouter;
