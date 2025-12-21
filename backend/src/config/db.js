const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        // Log masked URI to check availability without leaking secret
        const uri = process.env.MONGO_URI || '';
        console.log(`MONGO_URI detected: ${uri ? 'Yes (' + uri.substring(0, 15) + '...)' : 'No'}`);
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
