const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => console.log("Monogo DB connected"));
}

module.exports = connectToMongo;