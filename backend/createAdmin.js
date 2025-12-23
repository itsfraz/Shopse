const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // Adjust path as this file is in backend/ root
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@example.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('User already exists!');
            if (userExists.role !== 'admin') {
                console.log('User exists but is not admin. Promoting to admin...');
                userExists.role = 'admin';
                await userExists.save();
                console.log('User promoted to admin successfully.');
            } else {
                console.log('User is already an admin.');
            }
            process.exit();
        }

        const user = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'password123', // Default Password
            role: 'admin',
            mobile: '1234567890',
            address: {
                street: 'Admin St',
                city: 'Admin City',
                state: 'Admin State',
                zip: '00000',
                country: 'India'
            }
        });

        console.log(`Admin user created successfully: ${user.email}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
