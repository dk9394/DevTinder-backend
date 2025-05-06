const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(
		'mongodb+srv://wstudy9394:U8Wwso2mfGwmx0WB@self.nhwzj15.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Self'
	);
};

module.exports = {
	connectDB,
};
