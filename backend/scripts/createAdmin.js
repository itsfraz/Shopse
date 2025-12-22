const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@shop.com';
        const adminPass = 'admin123';

        // Check if exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user already exists. Updating role...');
            user.role = 'admin';
            // user.password = adminPass; // schema pre-save will hash it
            user.password = adminPass; 
            await user.save();
            console.log(`Updated existing user ${adminEmail} to admin.`);
        } else {
            console.log('Creating new admin user...');
            user = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPass,
                role: 'admin',
                mobile: '0000000000'
            });
            console.log(`Created new Admin User!`);
        }

        console.log('-----------------------------------');
        console.log('LOGIN CREDENTIALS:');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPass}`);
        console.log('-----------------------------------');

        process.exit(0);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
