const logout = (response) => {
	response.cookie('token', null, {
		expires: new Date(Date.now()),
	});
};

module.exports = {
	logout,
};
