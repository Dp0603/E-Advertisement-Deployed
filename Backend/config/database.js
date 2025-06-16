
const mongoose = require("mongoose");
// require("dotenv").config();
MONGO_URI = 'mongodb://127.0.0.1:27017/adUsers'
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("MongoDB connected...");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;

