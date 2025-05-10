const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(
		'mongodb+srv://wstudy9394:Hm5Tq0XnHWXNqOhv@cluster0.g1njepk.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Cluster0'
	);
};

module.exports = {
	connectDB,
};
