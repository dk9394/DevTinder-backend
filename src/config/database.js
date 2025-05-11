const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(
		'mongodb+srv://kdeepak9394:jgKLKcLu6ILeKxB3@cluster0.krlufjv.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Cluster0'
	);
};

module.exports = {
	connectDB,
};
