const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async () => {
    try {
        const email = process.argv[2];
        
        if (!email) {
            console.log('Usage: node scripts/makeAdmin.js <email>');
            process.exit(1);
        }

        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! User ${user.name} (${user.email}) is now an Admin.`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
